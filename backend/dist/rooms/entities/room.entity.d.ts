import { RoomStatus } from '../enums/room-status.enum';
export declare class Room {
    id: string;
    code: string;
    hostId: string;
    status: RoomStatus;
    text: string;
    maxPlayers: number;
    createdAt: Date;
    updatedAt: Date;
}
