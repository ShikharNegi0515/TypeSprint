import { User } from '../../users/entities/user.entity';
import { TypingTest } from './typing-test.entity';
export declare class TestResult {
    id: string;
    user: User;
    test?: TypingTest;
    wpm: number;
    rawWpm: number;
    accuracy: number;
    mistakes: number;
    characterCount: number;
    duration: number;
    mode: string;
    createdAt: Date;
}
