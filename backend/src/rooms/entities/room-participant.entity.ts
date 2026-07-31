import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity('room_participants')
export class RoomParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  username: string;

  @Column({ name: 'socket_id' })
  socketId: string;

  @Column({
    name: 'progress',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  progress: number;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2 })
  wpm?: number | null;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2 })
  accuracy?: number | null;

  @Column({ name: 'is_finished', default: false })
  isFinished: boolean;

  @Column({ type: 'int', nullable: true, name: 'finish_rank' })
  finishRank?: number | null;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
