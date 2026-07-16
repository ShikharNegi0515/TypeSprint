import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomParticipant } from './entities/room-participant.entity';
import { RoomStatus } from './enums/room-status.enum';
import { CreateRoomDto } from './dto/create-room.dto';

const SAMPLE_TEXTS = [
  "the quick brown fox jumps over the lazy dog while the sun sets behind the mountains casting long shadows across the valley floor",
  "programming is the art of telling another human what one wants the computer to do in a way that even a machine can understand it",
  "the only way to do great work is to love what you do if you have not found it yet keep looking do not settle as with all matters of the heart you will know when you find it",
  "in the beginning was the word and the word was with code and the code was a function that returned the meaning of life",
];

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomParticipant)
    private participantRepository: Repository<RoomParticipant>,
  ) {}

  async createRoom(userId: string, dto: CreateRoomDto): Promise<Room> {
    const code = generateRoomCode();
    const text = dto.customText || SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];

    const room = this.roomRepository.create({
      code,
      hostId: userId,
      text,
      maxPlayers: dto.maxPlayers || 5,
      status: RoomStatus.WAITING,
    });

    return this.roomRepository.save(room);
  }

  async getRoomByCode(code: string): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { code } });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async getRoomById(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async getParticipants(roomId: string): Promise<RoomParticipant[]> {
    return this.participantRepository.find({
      where: { room: { id: roomId } },
    });
  }

  async addParticipant(
    roomId: string,
    userId: string,
    username: string,
    socketId: string,
  ): Promise<RoomParticipant> {
    const room = await this.getRoomById(roomId);

    if (room.status !== RoomStatus.WAITING) {
      throw new BadRequestException('Room is not accepting players');
    }

    const existing = await this.participantRepository.findOne({
      where: { room: { id: roomId }, userId },
    });
    if (existing) {
      existing.socketId = socketId;
      return this.participantRepository.save(existing);
    }

    const participants = await this.getParticipants(roomId);
    if (participants.length >= room.maxPlayers) {
      throw new BadRequestException('Room is full');
    }

    const participant = this.participantRepository.create({
      room: { id: roomId },
      userId,
      username,
      socketId,
      progress: 0,
      isFinished: false,
    });

    return this.participantRepository.save(participant);
  }

  async removeParticipant(roomId: string, socketId: string): Promise<void> {
    await this.participantRepository.delete({ room: { id: roomId }, socketId });
  }

  async updateProgress(
    roomId: string,
    userId: string,
    progress: number,
    wpm: number,
  ): Promise<RoomParticipant | null> {
    const participant = await this.participantRepository.findOne({
      where: { room: { id: roomId }, userId },
    });
    if (!participant) return null;

    participant.progress = progress;
    participant.wpm = wpm;

    if (progress >= 100 && !participant.isFinished) {
      participant.isFinished = true;
      const finished = await this.participantRepository.find({
        where: { room: { id: roomId }, isFinished: true },
      });
      participant.finishRank = finished.length + 1;
    }

    return this.participantRepository.save(participant);
  }

  async updateRoomStatus(roomId: string, status: RoomStatus): Promise<void> {
    await this.roomRepository.update(roomId, { status });
  }

  async resetRoom(roomId: string): Promise<void> {
    const texts = SAMPLE_TEXTS;
    const newText = texts[Math.floor(Math.random() * texts.length)];
    await this.roomRepository.update(roomId, {
      status: RoomStatus.WAITING,
      text: newText,
    });
    await this.participantRepository.update(
      { room: { id: roomId } },
      { progress: 0, wpm: undefined, accuracy: undefined, isFinished: false, finishRank: undefined },
    );
  }
}
