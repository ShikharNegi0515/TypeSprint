import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from './users/entities/user.entity';
import { TypingTest } from './typing/entities/typing-test.entity';
import { TestResult } from './typing/entities/test-result.entity';
import { Room } from './rooms/entities/room.entity';
import { RoomParticipant } from './rooms/entities/room-participant.entity';
import { UserAchievement } from './achievements/entities/user-achievement.entity';

// Load environment variables from .env
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'typesprint',
  entities: [
    User,
    TypingTest,
    TestResult,
    Room,
    RoomParticipant,
    UserAchievement,
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // Critical: Turned off for production safety
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
