import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('achievements')
@ApiBearerAuth()
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user achievements' })
  getMyAchievements(@CurrentUser() user: any) {
    return this.achievementsService.getUserAchievements(user.id);
  }
}
