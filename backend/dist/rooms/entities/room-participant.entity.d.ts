import { Room } from './room.entity';
export declare class RoomParticipant {
    id: string;
    room: Room;
    userId: string;
    username: string;
    socketId: string;
    progress: number;
    wpm?: number;
    accuracy?: number;
    isFinished: boolean;
    finishRank?: number;
    joinedAt: Date;
}
