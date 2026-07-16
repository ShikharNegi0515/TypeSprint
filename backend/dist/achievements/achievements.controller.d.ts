import { AchievementsService } from './achievements.service';
export declare class AchievementsController {
    private readonly achievementsService;
    constructor(achievementsService: AchievementsService);
    getMyAchievements(user: any): Promise<{
        unlockedAt: Date;
        id: string;
        title: string;
        description: string;
        icon: string;
        color: string;
    }[]>;
}
