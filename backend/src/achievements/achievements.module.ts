import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { UserAchievement } from './entities/user-achievement.entity';
import { TestResult } from '../typing/entities/test-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAchievement, TestResult])],
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}
