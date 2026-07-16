import { Repository } from 'typeorm';
import { UserAchievement } from './entities/user-achievement.entity';
export interface AchievementDef {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}
export declare const ACHIEVEMENTS: Record<string, AchievementDef>;
export declare class AchievementsService {
    private userAchievementRepository;
    private readonly logger;
    constructor(userAchievementRepository: Repository<UserAchievement>);
    getUserAchievements(userId: string): Promise<{
        unlockedAt: Date;
        id: string;
        title: string;
        description: string;
        icon: string;
        color: string;
    }[]>;
    checkAndAwardAchievements(userId: string, stats: {
        wpm: number;
        accuracy: number;
        duration: number;
        totalTests: number;
    }): Promise<AchievementDef[]>;
}
