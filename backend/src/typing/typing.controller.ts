import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TypingService } from './typing.service';
import { CreateTestResultDto } from './dto/create-test-result.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('typing')
@ApiBearerAuth()
@Controller('typing')
export class TypingController {
  constructor(private readonly typingService: TypingService) {}

  @Post('results')
  @ApiOperation({ summary: 'Save a typing test result' })
  async saveResult(
    @CurrentUser() user: User,
    @Body() createTestResultDto: CreateTestResultDto,
  ) {
    return this.typingService.saveResult(user.id, createTestResultDto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get user typing test history' })
  async getHistory(@CurrentUser() user: User) {
    return this.typingService.getUserHistory(user.id);
  }

  @Get('tests')
  @ApiOperation({ summary: 'Get available typing tests by mode' })
  async getTests(@Query('mode') mode: string) {
    return this.typingService.getTypingTestsByMode(mode || 'words');
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get overall user typing stats' })
  async getStats(@CurrentUser() user: User) {
    return this.typingService.getStats(user.id);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get analytics data for charts' })
  async getAnalytics(@CurrentUser() user: User) {
    return this.typingService.getAnalytics(user.id);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get global leaderboard' })
  async getLeaderboard(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.typingService.getLeaderboard(parsedLimit);
  }
}
