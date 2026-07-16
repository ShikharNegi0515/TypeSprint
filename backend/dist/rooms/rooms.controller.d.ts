import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    createRoom(user: any, dto: CreateRoomDto): Promise<import("./entities/room.entity").Room>;
    getRoom(code: string): Promise<import("./entities/room.entity").Room>;
    getParticipants(id: string): Promise<import("./entities/room-participant.entity").RoomParticipant[]>;
}
