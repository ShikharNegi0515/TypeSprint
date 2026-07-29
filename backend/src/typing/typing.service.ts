import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestResult } from './entities/test-result.entity';
import { TypingTest } from './entities/typing-test.entity';
import { CreateTestResultDto } from './dto/create-test-result.dto';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class TypingService {
  private readonly logger = new Logger(TypingService.name);

  constructor(
    @InjectRepository(TestResult)
    private testResultRepository: Repository<TestResult>,
    @InjectRepository(TypingTest)
    private typingTestRepository: Repository<TypingTest>,
    private achievementsService: AchievementsService,
  ) {}

  async saveResult(
    userId: string,
    createTestResultDto: CreateTestResultDto,
  ): Promise<TestResult> {
    let test = null;
    if (createTestResultDto.testId) {
      test = await this.typingTestRepository.findOne({
        where: { id: createTestResultDto.testId },
      });
    }

    const result = this.testResultRepository.create({
      ...createTestResultDto,
      user: { id: userId },
      test: test || undefined,
    });

    const savedResult = await this.testResultRepository.save(result);

    // Check for achievements
    const totalTests = await this.testResultRepository.count({
      where: { user: { id: userId } },
    });
    await this.achievementsService.checkAndAwardAchievements(userId, {
      wpm: createTestResultDto.wpm,
      accuracy: createTestResultDto.accuracy,
      duration: createTestResultDto.duration,
      totalTests,
      mistakes: createTestResultDto.mistakes ?? 0,
      characterCount: createTestResultDto.characterCount ?? 0,
    });

    return savedResult;
  }

  async getUserHistory(userId: string): Promise<TestResult[]> {
    return this.testResultRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 50, // Limit to recent 50 for now
    });
  }

  async getTypingTestsByMode(mode: string): Promise<TypingTest[]> {
    return this.typingTestRepository.find({
      where: { mode },
    });
  }

  async getStats(userId: string) {
    const results = await this.testResultRepository.find({
      where: { user: { id: userId } },
    });

    if (results.length === 0) {
      return {
        totalTests: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        personalBest: 0,
        timeSpent: 0,
      };
    }

    const totalTests = results.length;
    const averageWpm =
      results.reduce((acc, curr) => acc + Number(curr.wpm), 0) / totalTests;
    const averageAccuracy =
      results.reduce((acc, curr) => acc + Number(curr.accuracy), 0) /
      totalTests;
    const personalBest = Math.max(...results.map((r) => Number(r.wpm)));
    const timeSpent = results.reduce(
      (acc, curr) => acc + Number(curr.duration),
      0,
    );

    const heatmap: Record<string, number> = {};
    results.forEach((r) => {
      if (r.missedChars) {
        let missedMap: unknown = r.missedChars;
        if (typeof missedMap === 'string') {
          try {
            missedMap = JSON.parse(missedMap);
          } catch {
            missedMap = null;
          }
        }
        if (typeof missedMap === 'object' && missedMap !== null) {
          for (const [char, count] of Object.entries(
            missedMap as Record<string, number>,
          )) {
            const lowerChar = char.toLowerCase();
            heatmap[lowerChar] = (heatmap[lowerChar] || 0) + count;
          }
        }
      }
    });

    return {
      totalTests,
      averageWpm: Math.round(averageWpm),
      averageAccuracy: Math.round(averageAccuracy),
      personalBest: Math.round(personalBest),
      timeSpent,
      heatmap,
    };
  }

  async getAnalytics(userId: string) {
    const results = await this.testResultRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
    });

    // Format for Recharts: array of objects with date, wpm, accuracy
    return results.map((r) => ({
      date: r.createdAt.toLocaleDateString(),
      wpm: Number(r.wpm),
      accuracy: Number(r.accuracy),
      mistakes: Number(r.mistakes),
      rawWpm: Number(r.rawWpm),
    }));
  }

  async getLeaderboard(limit: number = 10) {
    const qb = this.testResultRepository
      .createQueryBuilder('result')
      .leftJoin('result.user', 'user')
      .select([
        'user.id as "userId"',
        'user.username as "username"',
        'MAX(result.wpm) as "wpm"',
        'MAX(result.accuracy) as "accuracy"',
        'MAX(result.createdAt) as "date"',
      ])
      .where('user.id IS NOT NULL')
      .groupBy('user.id')
      .addGroupBy('user.username')
      .orderBy('"wpm"', 'DESC')
      .addOrderBy('"accuracy"', 'DESC')
      .limit(limit);

    interface LeaderboardRaw {
      userId: string;
      username: string;
      wpm: string | number;
      accuracy: string | number;
      date: string | Date;
    }

    const topResults = await qb.getRawMany<LeaderboardRaw>();

    return topResults.map((r) => ({
      id: r.userId, // use userId as unique key for leaderboard entry
      userId: r.userId,
      username: r.username,
      wpm: Number(r.wpm),
      accuracy: Number(r.accuracy),
      date: r.date,
    }));
  }
}
