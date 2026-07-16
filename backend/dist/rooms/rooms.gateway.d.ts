import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';
export declare class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly roomsService;
    server: Server;
    private readonly logger;
    private socketMap;
    constructor(roomsService: RoomsService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoin(client: Socket, payload: {
        roomCode: string;
        userId: string;
        username: string;
    }): Promise<void>;
    handleStart(client: Socket, payload: {
        roomId: string;
        userId: string;
    }): Promise<void>;
    handleProgress(client: Socket, payload: {
        roomId: string;
        userId: string;
        progress: number;
        wpm: number;
    }): Promise<void>;
    handleChat(client: Socket, payload: {
        roomId: string;
        username: string;
        message: string;
    }): void;
    handleRematch(client: Socket, payload: {
        roomId: string;
        userId: string;
    }): Promise<void>;
}
