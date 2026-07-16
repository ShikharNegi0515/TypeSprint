import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypingService } from './typing.service';
import { TypingController } from './typing.controller';
import { TypingTest } from './entities/typing-test.entity';
import { TestResult } from './entities/test-result.entity';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [TypeOrmModule.forFeature([TypingTest, TestResult]), AchievementsModule],
  controllers: [TypingController],
  providers: [TypingService],
  exports: [TypingService],
})
export class TypingModule {}
