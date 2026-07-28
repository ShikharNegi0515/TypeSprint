import {
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
  Min,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestResultDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  wpm: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  rawWpm: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  accuracy: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  mistakes: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  characterCount: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  duration: number;

  @ApiProperty()
  @IsString()
  mode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  testId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  missedChars?: Record<string, number>;
}
