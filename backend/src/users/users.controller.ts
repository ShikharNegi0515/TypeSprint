import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMyProfile(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
