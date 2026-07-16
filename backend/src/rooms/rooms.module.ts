import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsGateway } from './rooms.gateway';
import { Room } from './entities/room.entity';
import { RoomParticipant } from './entities/room-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomParticipant])],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsGateway],
  exports: [RoomsService],
})
export class RoomsModule {}
