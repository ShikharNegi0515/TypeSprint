import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DailyChallenge } from './daily-challenge.entity';

/** One entry per (user, challenge) pair */
@Entity('daily_challenge_results')
@Unique(['user', 'challenge'])
export class DailyChallengeResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => DailyChallenge, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'challenge_id' })
  challenge: DailyChallenge;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  wpm: number;

  @Column({ name: 'raw_wpm', type: 'decimal', precision: 5, scale: 2 })
  rawWpm: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  accuracy: number;

  @Column()
  mistakes: number;

  @Column()
  duration: number;

  @CreateDateColumn({ name: 'created_at' })
  completedAt: Date;
}
