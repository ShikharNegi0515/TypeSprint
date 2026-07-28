import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyChallenge } from './entities/daily-challenge.entity';
import { DailyChallengeResult } from './entities/daily-challenge-result.entity';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
import { AchievementsService } from '../achievements/achievements.service';

// A seeded pool of challenge sentences (used cyclically / by date hash)
const CHALLENGE_POOL = [
  'the quick brown fox jumps over the lazy dog and then sprints back to the starting point',
  'practice makes perfect so keep your fingers flying across the keyboard without hesitation',
  'every keystroke brings you closer to mastery and the thrill of breaking your own record',
  'speed is nothing without accuracy so focus on hitting every letter with precision today',
  'the art of typing is a dance between your brain and your fingers in perfect synchrony',
  'champions are made in the moments when they want to quit but push through regardless',
  'the journey of a thousand words begins with a single keystroke typed with intention',
  'great typists are not born they are forged through hours of deliberate daily practice',
  'your words per minute is a reflection of how well you know your keyboard like an old friend',
  'breathe deeply focus your eyes on the text and let your muscle memory do the heavy lifting',
  'consistency beats talent when talent refuses to practice so show up every single day',
  'the fastest typists in the world once sat where you sit struggling with the same letters',
  'embrace each mistake as a lesson your fingers are learning the language of the keyboard',
  'a sharp mind and nimble fingers are all you need to conquer any typing challenge today',
  'words flow fastest when you stop thinking about individual letters and type whole words',
  'the difference between a good typist and a great one is measured in milliseconds of focus',
  'find your rhythm let it carry you forward and do not let a single error break your stride',
  'typing is thinking made visible so clear your mind and let your thoughts travel to the keys',
  'the keyboard is your instrument and today you compose a symphony of speed and accuracy',
  'every test is a chance to discover what you are capable of when you push past your limits',
  'develop a habit of reviewing your mistakes because growth lives at the edge of comfort',
  'the screen is your stage and every character you type is a step in the right direction',
  'trust your training and your fingers will find the right keys even before your eyes confirm',
  'maintain a tall posture relax your wrists and let gravity do half the work for you today',
  'the leaderboard is not just about rankings it is a map of how far you have already come',
  'words become weapons when wielded with speed and accuracy on the battlefield of the keyboard',
  'silence your inner critic and let your muscle memory speak louder than your self doubt',
  'the best time to practice was yesterday the second best time is right now in this moment',
  'celebrate every small victory because progress is built from dozens of tiny improvements',
  'a new personal best is always one focused session away so give this test everything you have',
];

function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function pickTextForDate(date: string): string {
  // Deterministic pick based on date string hash
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash << 5) - hash + date.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % CHALLENGE_POOL.length;
  return CHALLENGE_POOL[idx];
}

@Injectable()
export class DailyChallengeService {
  constructor(
    @InjectRepository(DailyChallenge)
    private challengeRepo: Repository<DailyChallenge>,
    @InjectRepository(DailyChallengeResult)
    private resultRepo: Repository<DailyChallengeResult>,
    private achievementsService: AchievementsService,
  ) {}

  /** Gets (or creates) today's challenge */
  async getToday(): Promise<DailyChallenge> {
    const date = getTodayKey();
    let challenge = await this.challengeRepo.findOne({ where: { date } });
    if (!challenge) {
      challenge = this.challengeRepo.create({
        date,
        text: pickTextForDate(date),
      });
      challenge = await this.challengeRepo.save(challenge);
    }
    return challenge;
  }

  /** Returns today's leaderboard (all participants) */
  async getLeaderboard() {
    const date = getTodayKey();
    const challenge = await this.challengeRepo.findOne({ where: { date } });
    if (!challenge) return [];

    const results = await this.resultRepo
      .createQueryBuilder('r')
      .leftJoin('r.user', 'u')
      .leftJoin('r.challenge', 'c')
      .select([
        'u.id AS "userId"',
        'u.username AS username',
        'r.wpm AS wpm',
        'r.accuracy AS accuracy',
        'r.completedAt AS "completedAt"',
      ])
      .where('c.id = :id', { id: challenge.id })
      .orderBy('r.wpm', 'DESC')
      .addOrderBy('r.accuracy', 'DESC')
      .getRawMany();

    return results.map((r, i) => ({
      rank: i + 1,
      userId: r.userId,
      username: r.username,
      wpm: Number(r.wpm),
      accuracy: Number(r.accuracy),
      completedAt: r.completedAt,
    }));
  }

  /** Check whether a user has already submitted today */
  async hasCompleted(userId: string): Promise<boolean> {
    const challenge = await this.getToday();
    const existing = await this.resultRepo.findOne({
      where: {
        user: { id: userId },
        challenge: { id: challenge.id },
      },
    });
    return !!existing;
  }

  /** Submit a result (idempotent — throws ConflictException on duplicate) */
  async submit(userId: string, dto: SubmitChallengeDto) {
    const challenge = await this.getToday();

    const existing = await this.resultRepo.findOne({
      where: {
        user: { id: userId },
        challenge: { id: challenge.id },
      },
    });
    if (existing) {
      throw new ConflictException('You have already submitted today\'s challenge');
    }

    const result = this.resultRepo.create({
      ...dto,
      user: { id: userId } as any,
      challenge: { id: challenge.id } as any,
    });
    const saved = await this.resultRepo.save(result);

    // ── Check daily achievements ─────────────────────────────────────────
    try {
      const leaderboard = await this.getLeaderboard();
      const entry = leaderboard.find((e) => e.userId === userId);
      const rank = entry?.rank ?? leaderboard.length;
      await this.achievementsService.checkDailyAchievements(userId, rank, leaderboard.length);
    } catch (e) {
      // Non-fatal
    }

    return saved;
  }
}
