import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAchievement } from './entities/user-achievement.entity';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const ACHIEVEMENTS: Record<string, AchievementDef> = {
  first_test: {
    id: 'first_test',
    title: 'First Steps',
    description: 'Complete your first typing test',
    icon: '🎯',
    color: 'bg-blue-500/20 text-blue-500',
  },
  speed_demon: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Reach 100 WPM',
    icon: '⚡',
    color: 'bg-yellow-500/20 text-yellow-500',
  },
  perfectionist: {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Finish a test with 100% accuracy',
    icon: '✨',
    color: 'bg-purple-500/20 text-purple-500',
  },
  marathon: {
    id: 'marathon',
    title: 'Marathon',
    description: 'Complete a 120-second test',
    icon: '🏃',
    color: 'bg-green-500/20 text-green-500',
  },
};

@Injectable()
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,
  ) {}

  async getUserAchievements(userId: string) {
    const records = await this.userAchievementRepository.find({
      where: { user: { id: userId } },
      order: { unlockedAt: 'DESC' },
    });

    return records
      .map((r) => ({
        ...ACHIEVEMENTS[r.achievementId],
        unlockedAt: r.unlockedAt,
      }))
      .filter((a) => a.id); // Filter out any unknown achievements
  }

  async checkAndAwardAchievements(
    userId: string,
    stats: {
      wpm: number;
      accuracy: number;
      duration: number;
      totalTests: number;
    },
  ) {
    const existing = await this.userAchievementRepository.find({
      where: { user: { id: userId } },
    });
    const unlockedIds = new Set(existing.map((e) => e.achievementId));

    const newlyUnlocked: string[] = [];

    if (stats.totalTests >= 1 && !unlockedIds.has('first_test'))
      newlyUnlocked.push('first_test');
    if (stats.wpm >= 100 && !unlockedIds.has('speed_demon'))
      newlyUnlocked.push('speed_demon');
    if (stats.accuracy >= 100 && !unlockedIds.has('perfectionist'))
      newlyUnlocked.push('perfectionist');
    if (stats.duration >= 120 && !unlockedIds.has('marathon'))
      newlyUnlocked.push('marathon');

    if (newlyUnlocked.length > 0) {
      const entities = newlyUnlocked.map((id) =>
        this.userAchievementRepository.create({
          user: { id: userId },
          achievementId: id,
        }),
      );
      await this.userAchievementRepository.save(entities);
      this.logger.log(
        `Awarded achievements [${newlyUnlocked.join(', ')}] to user ${userId}`,
      );
    }

    return newlyUnlocked.map((id) => ACHIEVEMENTS[id]);
  }
}
