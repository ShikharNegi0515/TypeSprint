import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('daily_challenges')
@Unique(['date'])
export class DailyChallenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** ISO date string: YYYY-MM-DD */
  @Column({ type: 'varchar', length: 10 })
  date: string;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
