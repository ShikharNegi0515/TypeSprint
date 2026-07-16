import { User } from '../../users/entities/user.entity';
export declare class UserAchievement {
    id: string;
    user: User;
    achievementId: string;
    unlockedAt: Date;
}
