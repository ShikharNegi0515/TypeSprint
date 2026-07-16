import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AiCategory, AiDifficulty } from '../enums/ai.enum';

export class GenerateTextDto {
  @ApiPropertyOptional({ enum: AiCategory, default: AiCategory.GENERAL })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(AiCategory))
  category?: AiCategory = AiCategory.GENERAL;

  @ApiPropertyOptional({ enum: AiDifficulty, default: AiDifficulty.MEDIUM })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(AiDifficulty))
  difficulty?: AiDifficulty = AiDifficulty.MEDIUM;
}
