import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAchievement } from './entities/user-achievement.entity';
import { TestResult } from '../typing/entities/test-result.entity';

import { User } from '../users/entities/user.entity';

export type AchievementCategory =
  'speed' | 'accuracy' | 'volume' | 'time' | 'special';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  hint: string;
  icon: string;
  color: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
}

export const ACHIEVEMENTS: Record<string, AchievementDef> = {
  // ── Volume ──────────────────────────────────────────────────────────────
  first_test: {
    id: 'first_test',
    title: 'First Steps',
    icon: '🎯',
    color: '#3b82f6',
    description: 'Complete your first typing test',
    hint: 'Complete 1 test',
    category: 'volume',
    rarity: 'common',
  },
  slow_and_steady: {
    id: 'slow_and_steady',
    title: 'Slow & Steady',
    icon: '🐢',
    color: '#22c55e',
    description: 'Complete 10 typing tests',
    hint: 'Complete 10 tests',
    category: 'volume',
    rarity: 'common',
  },
  bookworm: {
    id: 'bookworm',
    title: 'Bookworm',
    icon: '📚',
    color: '#f59e0b',
    description: 'Complete 50 typing tests',
    hint: 'Complete 50 tests',
    category: 'volume',
    rarity: 'rare',
  },
  centurion: {
    id: 'centurion',
    title: 'Centurion',
    icon: '🦅',
    color: '#8b5cf6',
    description: 'Complete 100 typing tests — true dedication',
    hint: 'Complete 100 tests',
    category: 'volume',
    rarity: 'epic',
  },
  marathon: {
    id: 'marathon',
    title: 'Marathon',
    icon: '🏃',
    color: '#22c55e',
    description: 'Complete a test lasting 120 seconds or more',
    hint: 'Finish a test ≥ 120 seconds',
    category: 'volume',
    rarity: 'rare',
  },
  // ── Speed ───────────────────────────────────────────────────────────────
  rocket: {
    id: 'rocket',
    title: 'Rocket',
    icon: '🚀',
    color: '#3b82f6',
    description: 'Hit 60 WPM in a single test',
    hint: 'Score 60+ WPM',
    category: 'speed',
    rarity: 'common',
  },
  speed_demon: {
    id: 'speed_demon',
    title: 'Speed Demon',
    icon: '⚡',
    color: '#f59e0b',
    description: 'Reach the 100 WPM milestone',
    hint: 'Score 100+ WPM',
    category: 'speed',
    rarity: 'rare',
  },
  lightning_god: {
    id: 'lightning_god',
    title: 'Lightning God',
    icon: '🌩️',
    color: '#a855f7',
    description: 'Reach 150 WPM — elite territory',
    hint: 'Score 150+ WPM',
    category: 'speed',
    rarity: 'epic',
  },
  on_fire: {
    id: 'on_fire',
    title: 'On Fire',
    icon: '🔥',
    color: '#ef4444',
    description:
      'Last 3 tests all beat your all-time average WPM (needs 20+ tests)',
    hint: 'Beat avg WPM 3 times in a row after 20 tests',
    category: 'speed',
    rarity: 'legendary',
  },
  sharpshooter: {
    id: 'sharpshooter',
    title: 'Sharpshooter',
    icon: '🏹',
    color: '#06b6d4',
    description: 'Score 98%+ accuracy AND 80+ WPM in the same test',
    hint: '≥98% accuracy + ≥80 WPM in one test',
    category: 'speed',
    rarity: 'epic',
  },
  // ── Accuracy ────────────────────────────────────────────────────────────
  perfectionist: {
    id: 'perfectionist',
    title: 'Perfectionist',
    icon: '✨',
    color: '#a855f7',
    description: 'Finish any test with 100% accuracy',
    hint: 'Zero mistakes in one test',
    category: 'accuracy',
    rarity: 'rare',
  },
  diamond_hands: {
    id: 'diamond_hands',
    title: 'Diamond Hands',
    icon: '💎',
    color: '#06b6d4',
    description: 'Achieve 95%+ accuracy in 10 different tests',
    hint: '10 tests with ≥95% accuracy',
    category: 'accuracy',
    rarity: 'epic',
  },
  no_mercy: {
    id: 'no_mercy',
    title: 'No Mercy',
    icon: '🎪',
    color: '#ec4899',
    description: 'Zero mistakes on a test of 25+ seconds or 25+ words',
    hint: '0 mistakes on a long test (≥25s or ≥25 words)',
    category: 'accuracy',
    rarity: 'legendary',
  },
  // ── Time ────────────────────────────────────────────────────────────────
  time_keeper: {
    id: 'time_keeper',
    title: 'Time Keeper',
    icon: '⏱️',
    color: '#f59e0b',
    description: 'Spend 60 minutes total typing',
    hint: '60 min cumulative typing time',
    category: 'time',
    rarity: 'rare',
  },
  grinder: {
    id: 'grinder',
    title: 'Grinder',
    icon: '🕰️',
    color: '#8b5cf6',
    description: 'Spend 3 hours total typing',
    hint: '180 min cumulative typing time',
    category: 'time',
    rarity: 'epic',
  },
  night_owl: {
    id: 'night_owl',
    title: 'Night Owl',
    icon: '🌙',
    color: '#a855f7',
    description: 'Spend 5 hours total typing — you live here',
    hint: '300 min cumulative typing time',
    category: 'time',
    rarity: 'legendary',
  },
  // ── Special ─────────────────────────────────────────────────────────────
  early_bird: {
    id: 'early_bird',
    title: 'Early Bird',
    icon: '🌅',
    color: '#f59e0b',
    description: 'Complete the Daily Challenge',
    hint: 'Finish any Daily Challenge',
    category: 'special',
    rarity: 'rare',
  },
  ghost_mode: {
    id: 'ghost_mode',
    title: 'Ghost Mode',
    icon: '👻',
    color: '#6366f1',
    description: 'Use the Ghost Typer replay feature after a test',
    hint: 'Watch your ghost replay',
    category: 'special',
    rarity: 'rare',
  },
  showoff: {
    id: 'showoff',
    title: 'Showoff',
    icon: '📸',
    color: '#ec4899',
    description: 'Copy a screenshot of your results to clipboard',
    hint: 'Copy your results screenshot',
    category: 'special',
    rarity: 'rare',
  },
  champion: {
    id: 'champion',
    title: 'Champion',
    icon: '🏆',
    color: '#f59e0b',
    description:
      'Reach #1 on the Daily Challenge leaderboard with 10+ participants',
    hint: 'Top the daily leaderboard (10+ players)',
    category: 'special',
    rarity: 'legendary',
  },
};

// ── Progress helpers ────────────────────────────────────────────────────────
export interface AchievementProgress {
  current: number;
  required: number;
  unit?: string;
}

function calcProgress(
  id: string,
  totalTests: number,
  totalTimeSec: number,
  bestWpm: number,
  highAccCount: number,
): AchievementProgress | null {
  const min = Math.floor(totalTimeSec / 60);
  switch (id) {
    case 'first_test':
      return { current: Math.min(totalTests, 1), required: 1, unit: 'test' };
    case 'slow_and_steady':
      return { current: Math.min(totalTests, 10), required: 10, unit: 'tests' };
    case 'bookworm':
      return { current: Math.min(totalTests, 50), required: 50, unit: 'tests' };
    case 'centurion':
      return {
        current: Math.min(totalTests, 100),
        required: 100,
        unit: 'tests',
      };
    case 'rocket':
      return { current: Math.min(bestWpm, 60), required: 60, unit: 'WPM' };
    case 'speed_demon':
      return { current: Math.min(bestWpm, 100), required: 100, unit: 'WPM' };
    case 'lightning_god':
      return { current: Math.min(bestWpm, 150), required: 150, unit: 'WPM' };
    case 'diamond_hands':
      return {
        current: Math.min(highAccCount, 10),
        required: 10,
        unit: 'tests',
      };
    case 'time_keeper':
      return { current: Math.min(min, 60), required: 60, unit: 'min' };
    case 'grinder':
      return { current: Math.min(min, 180), required: 180, unit: 'min' };
    case 'night_owl':
      return { current: Math.min(min, 300), required: 300, unit: 'min' };
    default:
      return null; // binary achievements
  }
}

@Injectable()
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,
    @InjectRepository(TestResult)
    private testResultRepository: Repository<TestResult>,
  ) {}

  // ── Public: unlocked only (used by old profile fetch) ──────────────────
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
      .filter((a) => a.id);
  }

  // ── Public: all achievements with unlock status + progress ──────────────
  async getAllWithProgress(userId: string) {
    const [records, results] = await Promise.all([
      this.userAchievementRepository.find({ where: { user: { id: userId } } }),
      this.testResultRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      }),
    ]);

    const unlockedMap = new Map(
      records.map((r) => [r.achievementId, r.unlockedAt]),
    );

    const totalTests = results.length;
    const totalTimeSec = results.reduce((s, r) => s + Number(r.duration), 0);
    const bestWpm =
      totalTests > 0 ? Math.max(...results.map((r) => Number(r.wpm))) : 0;
    const highAccCount = results.filter((r) => Number(r.accuracy) >= 95).length;

    return Object.values(ACHIEVEMENTS).map((ach) => ({
      ...ach,
      unlocked: unlockedMap.has(ach.id),
      unlockedAt: unlockedMap.get(ach.id) ?? null,
      progress: calcProgress(
        ach.id,
        totalTests,
        totalTimeSec,
        bestWpm,
        highAccCount,
      ),
    }));
  }

  // ── Award a specific achievement (used for special/frontend-triggered) ──
  async awardSpecial(userId: string, achievementId: string) {
    const allowed = ['ghost_mode', 'showoff'];
    if (!allowed.includes(achievementId)) return null;
    return this.awardIfNew(userId, achievementId);
  }

  // ── Internal: award if not already unlocked ─────────────────────────────
  private async awardIfNew(userId: string, id: string): Promise<string | null> {
    const existing = await this.userAchievementRepository.findOne({
      where: { user: { id: userId }, achievementId: id },
    });
    if (existing) return null;
    await this.userAchievementRepository.save(
      this.userAchievementRepository.create({
        user: { id: userId } as User,
        achievementId: id,
      }),
    );
    this.logger.log(`Awarded [${id}] to user ${userId}`);
    return id;
  }

  // ── Main hook called after every test ─────────────────────────────────
  async checkAndAwardAchievements(
    userId: string,
    stats: {
      wpm: number;
      accuracy: number;
      duration: number;
      totalTests: number;
      mistakes: number;
      characterCount: number;
    },
  ) {
    const existing = await this.userAchievementRepository.find({
      where: { user: { id: userId } },
    });
    const unlockedIds = new Set(existing.map((e) => e.achievementId));

    // Fetch historical results for complex checks (only if needed)
    let allResults: TestResult[] | null = null;
    const getAll = async () => {
      if (!allResults) {
        allResults = await this.testResultRepository.find({
          where: { user: { id: userId } },
          order: { createdAt: 'DESC' },
        });
      }
      return allResults;
    };

    const candidates: string[] = [];

    // ── Volume ────────────────────────────────────────────────────────────
    if (!unlockedIds.has('first_test') && stats.totalTests >= 1)
      candidates.push('first_test');
    if (!unlockedIds.has('slow_and_steady') && stats.totalTests >= 10)
      candidates.push('slow_and_steady');
    if (!unlockedIds.has('bookworm') && stats.totalTests >= 50)
      candidates.push('bookworm');
    if (!unlockedIds.has('centurion') && stats.totalTests >= 100)
      candidates.push('centurion');
    if (!unlockedIds.has('marathon') && stats.duration >= 120)
      candidates.push('marathon');

    // ── Speed ─────────────────────────────────────────────────────────────
    if (!unlockedIds.has('rocket') && stats.wpm >= 60)
      candidates.push('rocket');
    if (!unlockedIds.has('speed_demon') && stats.wpm >= 100)
      candidates.push('speed_demon');
    if (!unlockedIds.has('lightning_god') && stats.wpm >= 150)
      candidates.push('lightning_god');
    if (
      !unlockedIds.has('sharpshooter') &&
      stats.wpm >= 80 &&
      stats.accuracy >= 98
    )
      candidates.push('sharpshooter');

    if (!unlockedIds.has('on_fire') && stats.totalTests >= 20) {
      const all = await getAll();
      if (all.length >= 3) {
        const last3 = all.slice(0, 3).map((r) => Number(r.wpm));
        const avgWpm = all.reduce((s, r) => s + Number(r.wpm), 0) / all.length;
        if (last3.every((w) => w > avgWpm)) candidates.push('on_fire');
      }
    }

    // ── Accuracy ──────────────────────────────────────────────────────────
    if (!unlockedIds.has('perfectionist') && stats.accuracy >= 100)
      candidates.push('perfectionist');

    if (!unlockedIds.has('diamond_hands')) {
      const all = await getAll();
      const highAcc = all.filter((r) => Number(r.accuracy) >= 95).length;
      if (highAcc >= 10) candidates.push('diamond_hands');
    }

    if (!unlockedIds.has('no_mercy') && stats.mistakes === 0) {
      // characterCount / 5 ≈ word count; 25 words ≈ 125 chars
      const enoughWords = stats.characterCount >= 125;
      const enoughTime = stats.duration >= 25;
      if (enoughWords || enoughTime) candidates.push('no_mercy');
    }

    // ── Time ─────────────────────────────────────────────────────────────
    if (
      !unlockedIds.has('time_keeper') ||
      !unlockedIds.has('grinder') ||
      !unlockedIds.has('night_owl')
    ) {
      const all = await getAll();
      const totalSec = all.reduce((s, r) => s + Number(r.duration), 0);
      const totalMin = totalSec / 60;
      if (!unlockedIds.has('time_keeper') && totalMin >= 60)
        candidates.push('time_keeper');
      if (!unlockedIds.has('grinder') && totalMin >= 180)
        candidates.push('grinder');
      if (!unlockedIds.has('night_owl') && totalMin >= 300)
        candidates.push('night_owl');
    }

    // ── Save newly unlocked ───────────────────────────────────────────────
    if (candidates.length > 0) {
      const entities = candidates.map((id) =>
        this.userAchievementRepository.create({
          user: { id: userId } as User,
          achievementId: id,
        }),
      );
      await this.userAchievementRepository.save(entities);
      this.logger.log(`Awarded [${candidates.join(', ')}] to user ${userId}`);
    }

    return candidates.map((id) => ACHIEVEMENTS[id]);
  }

  // ── Daily-challenge hooks (called from DailyChallengeService) ───────────
  async checkDailyAchievements(
    userId: string,
    rank: number,
    totalParticipants: number,
  ) {
    await this.awardIfNew(userId, 'early_bird');
    if (rank === 1 && totalParticipants >= 10) {
      await this.awardIfNew(userId, 'champion');
    }
  }
}
