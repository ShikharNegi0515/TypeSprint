import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('achievements')
@ApiBearerAuth()
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user achievements (unlocked only)' })
  getMyAchievements(@CurrentUser() user: any) {
    return this.achievementsService.getUserAchievements(user.id);
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get all achievements with unlock status and progress' })
  getAllProgress(@CurrentUser() user: any) {
    return this.achievementsService.getAllWithProgress(user.id);
  }

  @Post('award/:id')
  @ApiOperation({ summary: 'Award a special (frontend-triggered) achievement' })
  awardSpecial(@CurrentUser() user: any, @Param('id') achievementId: string) {
    return this.achievementsService.awardSpecial(user.id, achievementId);
  }
}
