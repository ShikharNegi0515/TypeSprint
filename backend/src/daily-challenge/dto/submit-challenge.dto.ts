import { IsNumber, IsInt, Min } from 'class-validator';

export class SubmitChallengeDto {
  @IsNumber()
  wpm: number;

  @IsNumber()
  rawWpm: number;

  @IsNumber()
  accuracy: number;

  @IsInt()
  @Min(0)
  mistakes: number;

  @IsInt()
  @Min(1)
  duration: number;
}
