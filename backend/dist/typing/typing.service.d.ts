import { Repository } from 'typeorm';
import { TestResult } from './entities/test-result.entity';
import { TypingTest } from './entities/typing-test.entity';
import { CreateTestResultDto } from './dto/create-test-result.dto';
import { AchievementsService } from '../achievements/achievements.service';
export declare class TypingService {
    private testResultRepository;
    private typingTestRepository;
    private achievementsService;
    private readonly logger;
    constructor(testResultRepository: Repository<TestResult>, typingTestRepository: Repository<TypingTest>, achievementsService: AchievementsService);
    saveResult(userId: string, createTestResultDto: CreateTestResultDto): Promise<TestResult>;
    getUserHistory(userId: string): Promise<TestResult[]>;
    getTypingTestsByMode(mode: string): Promise<TypingTest[]>;
    getStats(userId: string): Promise<{
        totalTests: number;
        averageWpm: number;
        averageAccuracy: number;
        personalBest: number;
        timeSpent: number;
    }>;
    getAnalytics(userId: string): Promise<{
        date: string;
        wpm: number;
        accuracy: number;
        mistakes: number;
        rawWpm: number;
    }[]>;
    getLeaderboard(limit?: number): Promise<{
        id: string;
        userId: string;
        username: string;
        wpm: number;
        accuracy: number;
        date: Date;
    }[]>;
}
