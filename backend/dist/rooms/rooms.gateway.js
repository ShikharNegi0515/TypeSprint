"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RoomsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const rooms_service_1 = require("./rooms.service");
const room_status_enum_1 = require("./enums/room-status.enum");
let RoomsGateway = RoomsGateway_1 = class RoomsGateway {
    roomsService;
    server;
    logger = new common_1.Logger(RoomsGateway_1.name);
    socketMap = new Map();
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    async handleDisconnect(client) {
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
    async handleJoin(client, payload) {
        try {
            const room = await this.roomsService.getRoomByCode(payload.roomCode);
            const participant = await this.roomsService.addParticipant(room.id, payload.userId, payload.username, client.id);
            client.join(room.id);
            this.socketMap.set(client.id, {
                roomId: room.id,
                userId: payload.userId,
                username: payload.username,
            });
            const participants = await this.roomsService.getParticipants(room.id);
            client.emit('room:joined', {
                room,
                participant,
                participants,
            });
            client.to(room.id).emit('room:player_joined', { username: payload.username });
            this.server.to(room.id).emit('room:participants', participants);
        }
        catch (err) {
            client.emit('room:error', { message: err.message });
        }
    }
    async handleStart(client, payload) {
        const room = await this.roomsService.getRoomById(payload.roomId);
        if (room.hostId !== payload.userId) {
            client.emit('room:error', { message: 'Only the host can start the game' });
            return;
        }
        await this.roomsService.updateRoomStatus(payload.roomId, room_status_enum_1.RoomStatus.COUNTDOWN);
        this.server.to(payload.roomId).emit('room:countdown', { seconds: 3 });
        let count = 3;
        const interval = setInterval(async () => {
            count--;
            if (count > 0) {
                this.server.to(payload.roomId).emit('room:countdown', { seconds: count });
            }
            else {
                clearInterval(interval);
                await this.roomsService.updateRoomStatus(payload.roomId, room_status_enum_1.RoomStatus.PLAYING);
                this.server.to(payload.roomId).emit('room:started', { text: room.text });
            }
        }, 1000);
    }
    async handleProgress(client, payload) {
        const participant = await this.roomsService.updateProgress(payload.roomId, payload.userId, payload.progress, payload.wpm);
        if (!participant)
            return;
        this.server.to(payload.roomId).emit('room:player_progress', {
            userId: payload.userId,
            username: participant.username,
            progress: payload.progress,
            wpm: payload.wpm,
            isFinished: participant.isFinished,
            finishRank: participant.finishRank,
        });
        if (participant.isFinished) {
            const participants = await this.roomsService.getParticipants(payload.roomId);
            const allDone = participants.every((p) => p.isFinished);
            if (allDone) {
                await this.roomsService.updateRoomStatus(payload.roomId, room_status_enum_1.RoomStatus.FINISHED);
                this.server.to(payload.roomId).emit('room:finished', { participants });
            }
        }
    }
    handleChat(client, payload) {
        this.server.to(payload.roomId).emit('room:chat_message', {
            username: payload.username,
            message: payload.message,
            timestamp: new Date().toISOString(),
        });
    }
    async handleRematch(client, payload) {
        const room = await this.roomsService.getRoomById(payload.roomId);
        if (room.hostId !== payload.userId) {
            client.emit('room:error', { message: 'Only the host can request a rematch' });
            return;
        }
        await this.roomsService.resetRoom(payload.roomId);
        const updatedRoom = await this.roomsService.getRoomById(payload.roomId);
        const participants = await this.roomsService.getParticipants(payload.roomId);
        this.server.to(payload.roomId).emit('room:rematch', { room: updatedRoom, participants });
    }
};
exports.RoomsGateway = RoomsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RoomsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RoomsGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RoomsGateway.prototype, "handleStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:progress'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RoomsGateway.prototype, "handleProgress", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:rematch'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RoomsGateway.prototype, "handleRematch", null);
exports.RoomsGateway = RoomsGateway = RoomsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: '/rooms',
    }),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], RoomsGateway);
//# sourceMappingURL=rooms.gateway.js.map