import { TypingService } from './typing.service';
import { CreateTestResultDto } from './dto/create-test-result.dto';
export declare class TypingController {
    private readonly typingService;
    constructor(typingService: TypingService);
    saveResult(user: any, createTestResultDto: CreateTestResultDto): Promise<import("./entities/test-result.entity").TestResult>;
    getHistory(user: any): Promise<import("./entities/test-result.entity").TestResult[]>;
    getTests(mode: string): Promise<import("./entities/typing-test.entity").TypingTest[]>;
    getStats(user: any): Promise<{
        totalTests: number;
        averageWpm: number;
        averageAccuracy: number;
        personalBest: number;
        timeSpent: number;
    }>;
    getAnalytics(user: any): Promise<{
        date: string;
        wpm: number;
        accuracy: number;
        mistakes: number;
        rawWpm: number;
    }[]>;
    getLeaderboard(limit?: string): Promise<{
        id: string;
        userId: string;
        username: string;
        wpm: number;
        accuracy: number;
        date: Date;
    }[]>;
}
