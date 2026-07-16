import { Role } from '../enums/role.enum';
export declare class User {
    id: string;
    email: string;
    username: string;
    password?: string;
    googleId?: string;
    githubId?: string;
    avatar?: string;
    role: Role;
    xp: number;
    level: number;
    dailyStreak: number;
    createdAt: Date;
    updatedAt: Date;
}
