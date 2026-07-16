import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('typing_tests')
export class TypingTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  mode: string; // 'words', 'quotes', 'numbers', 'code', etc.

  @Column({ nullable: true })
  difficulty?: string; // 'easy', 'medium', 'hard'

  @Column({ nullable: true })
  language?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
