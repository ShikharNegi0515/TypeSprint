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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomParticipant = void 0;
const typeorm_1 = require("typeorm");
const room_entity_1 = require("./room.entity");
let RoomParticipant = class RoomParticipant {
    id;
    room;
    userId;
    username;
    socketId;
    progress;
    wpm;
    accuracy;
    isFinished;
    finishRank;
    joinedAt;
};
exports.RoomParticipant = RoomParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RoomParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'room_id' }),
    __metadata("design:type", room_entity_1.Room)
], RoomParticipant.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], RoomParticipant.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoomParticipant.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'socket_id' }),
    __metadata("design:type", String)
], RoomParticipant.prototype, "socketId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'progress', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], RoomParticipant.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], RoomParticipant.prototype, "wpm", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], RoomParticipant.prototype, "accuracy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_finished', default: false }),
    __metadata("design:type", Boolean)
], RoomParticipant.prototype, "isFinished", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'finish_rank' }),
    __metadata("design:type", Number)
], RoomParticipant.prototype, "finishRank", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'joined_at' }),
    __metadata("design:type", Date)
], RoomParticipant.prototype, "joinedAt", void 0);
exports.RoomParticipant = RoomParticipant = __decorate([
    (0, typeorm_1.Entity)('room_participants')
], RoomParticipant);
//# sourceMappingURL=room-participant.entity.js.map