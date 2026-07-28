import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypingModule } from './typing/typing.module';
import { User } from './users/entities/user.entity';
import { TypingTest } from './typing/entities/typing-test.entity';
import { TestResult } from './typing/entities/test-result.entity';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RoomsModule } from './rooms/rooms.module';
import { Room } from './rooms/entities/room.entity';
import { RoomParticipant } from './rooms/entities/room-participant.entity';
import { AiModule } from './ai/ai.module';
import { AchievementsModule } from './achievements/achievements.module';
import { UserAchievement } from './achievements/entities/user-achievement.entity';
import { DailyChallengeModule } from './daily-challenge/daily-challenge.module';
import { DailyChallenge } from './daily-challenge/entities/daily-challenge.entity';
import { DailyChallengeResult } from './daily-challenge/entities/daily-challenge-result.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'typesprint'),
        entities: [
          User,
          TypingTest,
          TestResult,
          Room,
          RoomParticipant,
          UserAchievement,
          DailyChallenge,
          DailyChallengeResult,
        ],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    TypingModule,
    RoomsModule,
    AiModule,
    AchievementsModule,
    DailyChallengeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
