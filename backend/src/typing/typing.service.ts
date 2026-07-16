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

  async saveResult(userId: string, createTestResultDto: CreateTestResultDto): Promise<TestResult> {
    let test = null;
    if (createTestResultDto.testId) {
      test = await this.typingTestRepository.findOne({ where: { id: createTestResultDto.testId } });
    }

    const result = this.testResultRepository.create({
      ...createTestResultDto,
      user: { id: userId },
      test: test || undefined,
    });

    const savedResult = await this.testResultRepository.save(result);
    
    // Check for achievements
    const totalTests = await this.testResultRepository.count({ where: { user: { id: userId } } });
    await this.achievementsService.checkAndAwardAchievements(userId, {
      wpm: createTestResultDto.wpm,
      accuracy: createTestResultDto.accuracy,
      duration: createTestResultDto.duration,
      totalTests,
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
      return { totalTests: 0, averageWpm: 0, averageAccuracy: 0, personalBest: 0, timeSpent: 0 };
    }

    const totalTests = results.length;
    const averageWpm = results.reduce((acc, curr) => acc + Number(curr.wpm), 0) / totalTests;
    const averageAccuracy = results.reduce((acc, curr) => acc + Number(curr.accuracy), 0) / totalTests;
    const personalBest = Math.max(...results.map(r => Number(r.wpm)));
    const timeSpent = results.reduce((acc, curr) => acc + Number(curr.duration), 0);

    return {
      totalTests,
      averageWpm: Math.round(averageWpm),
      averageAccuracy: Math.round(averageAccuracy),
      personalBest: Math.round(personalBest),
      timeSpent,
    };
  }

  async getAnalytics(userId: string) {
    const results = await this.testResultRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
    });

    // Format for Recharts: array of objects with date, wpm, accuracy
    return results.map(r => ({
      date: r.createdAt.toLocaleDateString(),
      wpm: Number(r.wpm),
      accuracy: Number(r.accuracy),
      mistakes: Number(r.mistakes),
      rawWpm: Number(r.rawWpm),
    }));
  }

  async getLeaderboard(limit: number = 10) {
    // Get the top results ordered by WPM. 
    // For a simple implementation, we just get the top distinct tests.
    // Ideally, this should group by user to only show one entry per user.
    const qb = this.testResultRepository.createQueryBuilder('result')
      .leftJoinAndSelect('result.user', 'user')
      .orderBy('result.wpm', 'DESC')
      .addOrderBy('result.accuracy', 'DESC')
      .take(limit);

    const topResults = await qb.getMany();

    return topResults.map(r => ({
      id: r.id,
      userId: r.user?.id,
      username: r.user?.username,
      wpm: Number(r.wpm),
      accuracy: Number(r.accuracy),
      date: r.createdAt,
    }));
  }
}
