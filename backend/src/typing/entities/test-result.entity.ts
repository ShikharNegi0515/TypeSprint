import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TypingTest } from './typing-test.entity';

@Entity('test_results')
export class TestResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TypingTest, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'test_id' })
  test?: TypingTest;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  wpm: number;

  @Column({ name: 'raw_wpm', type: 'decimal', precision: 5, scale: 2 })
  rawWpm: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  accuracy: number;

  @Column()
  mistakes: number;

  @Column({ name: 'character_count' })
  characterCount: number;

  @Column()
  duration: number; // in seconds

  @Column()
  mode: string; // e.g., 'time', 'words', 'quote'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
