import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomStatus } from './enums/room-status.enum';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/rooms',
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RoomsGateway.name);

  // Track socket -> room+user mapping for disconnect cleanup
  private socketMap = new Map<
    string,
    { roomId: string; userId: string; username: string }
  >();

  constructor(private readonly roomsService: RoomsService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const info = this.socketMap.get(client.id);
    if (info) {
      const { roomId, username } = info;
      await this.roomsService.removeParticipant(roomId, client.id);
      this.socketMap.delete(client.id);
      const participants = await this.roomsService.getParticipants(roomId);
      this.server.to(roomId).emit('room:participants', participants);
      this.server.to(roomId).emit('room:player_left', { username });
    }
  }

  // ── Join Room ──────────────────────────────────────────────────────────────
  @SubscribeMessage('room:join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { roomCode: string; userId: string; username: string },
  ) {
    try {
      const room = await this.roomsService.getRoomByCode(payload.roomCode);
      const participant = await this.roomsService.addParticipant(
        room.id,
        payload.userId,
        payload.username,
        client.id,
      );

      await client.join(room.id);
      this.socketMap.set(client.id, {
        roomId: room.id,
        userId: payload.userId,
        username: payload.username,
      });

      const participants = await this.roomsService.getParticipants(room.id);

      // Tell the joiner the room info
      client.emit('room:joined', {
        room,
        participant,
        participants,
      });

      // Tell everyone else someone joined
      client
        .to(room.id)
        .emit('room:player_joined', { username: payload.username });
      this.server.to(room.id).emit('room:participants', participants);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      client.emit('room:error', { message });
    }
  }

  // ── Start Game (Host only) ─────────────────────────────────────────────────
  @SubscribeMessage('room:start')
  async handleStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; userId: string },
  ) {
    const room = await this.roomsService.getRoomById(payload.roomId);
    if (room.hostId !== payload.userId) {
      client.emit('room:error', {
        message: 'Only the host can start the game',
      });
      return;
    }

    // 3-second countdown
    await this.roomsService.updateRoomStatus(
      payload.roomId,
      RoomStatus.COUNTDOWN,
    );
    this.server.to(payload.roomId).emit('room:countdown', { seconds: 3 });

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        this.server
          .to(payload.roomId)
          .emit('room:countdown', { seconds: count });
      } else {
        clearInterval(interval);
        void this.roomsService
          .updateRoomStatus(payload.roomId, RoomStatus.PLAYING)
          .then(() => {
            this.server
              .to(payload.roomId)
              .emit('room:started', { text: room.text });
          });
      }
    }, 1000);
  }

  // ── Progress Update ────────────────────────────────────────────────────────
  @SubscribeMessage('room:progress')
  async handleProgress(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { roomId: string; userId: string; progress: number; wpm: number },
  ) {
    const participant = await this.roomsService.updateProgress(
      payload.roomId,
      payload.userId,
      payload.progress,
      payload.wpm,
    );

    if (!participant) return;

    this.server.to(payload.roomId).emit('room:player_progress', {
      userId: payload.userId,
      username: participant.username,
      progress: payload.progress,
      wpm: payload.wpm,
      isFinished: participant.isFinished,
      finishRank: participant.finishRank,
    });

    if (participant.isFinished) {
      const participants = await this.roomsService.getParticipants(
        payload.roomId,
      );
      const allDone = participants.every((p) => p.isFinished);
      if (allDone) {
        await this.roomsService.updateRoomStatus(
          payload.roomId,
          RoomStatus.FINISHED,
        );
        this.server.to(payload.roomId).emit('room:finished', { participants });
      }
    }
  }

  // ── Chat Message ───────────────────────────────────────────────────────────
  @SubscribeMessage('room:chat')
  handleChat(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { roomId: string; username: string; message: string },
  ) {
    this.server.to(payload.roomId).emit('room:chat_message', {
      username: payload.username,
      message: payload.message,
      timestamp: new Date().toISOString(),
    });
  }

  // ── Rematch (Host only) ───────────────────────────────────────────────────
  @SubscribeMessage('room:rematch')
  async handleRematch(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; userId: string },
  ) {
    const room = await this.roomsService.getRoomById(payload.roomId);
    if (room.hostId !== payload.userId) {
      client.emit('room:error', {
        message: 'Only the host can request a rematch',
      });
      return;
    }

    await this.roomsService.resetRoom(payload.roomId);
    const updatedRoom = await this.roomsService.getRoomById(payload.roomId);
    const participants = await this.roomsService.getParticipants(
      payload.roomId,
    );
    this.server
      .to(payload.roomId)
      .emit('room:rematch', { room: updatedRoom, participants });
  }
}
