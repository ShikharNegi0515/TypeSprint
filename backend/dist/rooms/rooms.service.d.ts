import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomParticipant } from './entities/room-participant.entity';
import { RoomStatus } from './enums/room-status.enum';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsService {
    private roomRepository;
    private participantRepository;
    constructor(roomRepository: Repository<Room>, participantRepository: Repository<RoomParticipant>);
    createRoom(userId: string, dto: CreateRoomDto): Promise<Room>;
    getRoomByCode(code: string): Promise<Room>;
    getRoomById(id: string): Promise<Room>;
    getParticipants(roomId: string): Promise<RoomParticipant[]>;
    addParticipant(roomId: string, userId: string, username: string, socketId: string): Promise<RoomParticipant>;
    removeParticipant(roomId: string, socketId: string): Promise<void>;
    updateProgress(roomId: string, userId: string, progress: number, wpm: number): Promise<RoomParticipant | null>;
    updateRoomStatus(roomId: string, status: RoomStatus): Promise<void>;
    resetRoom(roomId: string): Promise<void>;
}
