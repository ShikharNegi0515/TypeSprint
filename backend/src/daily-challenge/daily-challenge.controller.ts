import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DailyChallengeService } from './daily-challenge.service';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('daily-challenge')
@ApiBearerAuth()
@Controller('daily-challenge')
export class DailyChallengeController {
  constructor(private readonly service: DailyChallengeService) {}

  @Get('today')
  @ApiOperation({ summary: "Get today's challenge text and status" })
  async getToday(@CurrentUser() user: User) {
    const challenge = await this.service.getToday();
    const completed = await this.service.hasCompleted(user.id);
    return { ...challenge, completed };
  }

  @Get('leaderboard')
  @ApiOperation({ summary: "Get today's challenge leaderboard" })
  async getLeaderboard() {
    return this.service.getLeaderboard();
  }

  @Post('submit')
  @ApiOperation({ summary: "Submit result for today's challenge" })
  async submit(@CurrentUser() user: User, @Body() dto: SubmitChallengeDto) {
    return this.service.submit(user.id, dto);
  }
}
