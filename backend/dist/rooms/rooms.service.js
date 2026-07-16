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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("./entities/room.entity");
const room_participant_entity_1 = require("./entities/room-participant.entity");
const room_status_enum_1 = require("./enums/room-status.enum");
const SAMPLE_TEXTS = [
    "the quick brown fox jumps over the lazy dog while the sun sets behind the mountains casting long shadows across the valley floor",
    "programming is the art of telling another human what one wants the computer to do in a way that even a machine can understand it",
    "the only way to do great work is to love what you do if you have not found it yet keep looking do not settle as with all matters of the heart you will know when you find it",
    "in the beginning was the word and the word was with code and the code was a function that returned the meaning of life",
];
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}
let RoomsService = class RoomsService {
    roomRepository;
    participantRepository;
    constructor(roomRepository, participantRepository) {
        this.roomRepository = roomRepository;
        this.participantRepository = participantRepository;
    }
    async createRoom(userId, dto) {
        const code = generateRoomCode();
        const text = dto.customText || SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
        const room = this.roomRepository.create({
            code,
            hostId: userId,
            text,
            maxPlayers: dto.maxPlayers || 5,
            status: room_status_enum_1.RoomStatus.WAITING,
        });
        return this.roomRepository.save(room);
    }
    async getRoomByCode(code) {
        const room = await this.roomRepository.findOne({ where: { code } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        return room;
    }
    async getRoomById(id) {
        const room = await this.roomRepository.findOne({ where: { id } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        return room;
    }
    async getParticipants(roomId) {
        return this.participantRepository.find({
            where: { room: { id: roomId } },
        });
    }
    async addParticipant(roomId, userId, username, socketId) {
        const room = await this.getRoomById(roomId);
        if (room.status !== room_status_enum_1.RoomStatus.WAITING) {
            throw new common_1.BadRequestException('Room is not accepting players');
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
            throw new common_1.BadRequestException('Room is full');
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
    async removeParticipant(roomId, socketId) {
        await this.participantRepository.delete({ room: { id: roomId }, socketId });
    }
    async updateProgress(roomId, userId, progress, wpm) {
        const participant = await this.participantRepository.findOne({
            where: { room: { id: roomId }, userId },
        });
        if (!participant)
            return null;
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
    async updateRoomStatus(roomId, status) {
        await this.roomRepository.update(roomId, { status });
    }
    async resetRoom(roomId) {
        const texts = SAMPLE_TEXTS;
        const newText = texts[Math.floor(Math.random() * texts.length)];
        await this.roomRepository.update(roomId, {
            status: room_status_enum_1.RoomStatus.WAITING,
            text: newText,
        });
        await this.participantRepository.update({ room: { id: roomId } }, { progress: 0, wpm: undefined, accuracy: undefined, isFinished: false, finishRank: undefined });
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(room_participant_entity_1.RoomParticipant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map