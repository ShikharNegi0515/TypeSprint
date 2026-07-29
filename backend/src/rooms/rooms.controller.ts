import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('rooms')
@ApiBearerAuth()
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new multiplayer room' })
  createRoom(@CurrentUser() user: User, @Body() dto: CreateRoomDto) {
    return this.roomsService.createRoom(user.id, dto);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get room by code' })
  getRoom(@Param('code') code: string) {
    return this.roomsService.getRoomByCode(code);
  }

  @Get(':id/participants')
  @ApiOperation({ summary: 'Get participants of a room' })
  getParticipants(@Param('id') id: string) {
    return this.roomsService.getParticipants(id);
  }
}
