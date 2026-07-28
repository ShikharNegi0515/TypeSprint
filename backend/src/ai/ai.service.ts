import { Injectable, Logger } from '@nestjs/common';
import { AiProvider } from './interfaces/ai-provider.interface';
import { GenerateTextDto } from './dto/generate-text.dto';
import { AiCategory, AiDifficulty } from './enums/ai.enum';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly aiProvider: AiProvider) {}

  async generateText(
    dto: GenerateTextDto,
  ): Promise<{ text: string; category: string; difficulty: string }> {
    const category = dto.category || AiCategory.GENERAL;
    const difficulty = dto.difficulty || AiDifficulty.MEDIUM;

    this.logger.log(
      `Generating text: category=${category}, difficulty=${difficulty}`,
    );

    const text = await this.aiProvider.generateText(category, difficulty);

    return { text, category, difficulty };
  }

  getCategories(): string[] {
    return Object.values(AiCategory);
  }

  getDifficulties(): string[] {
    return Object.values(AiDifficulty);
  }
}
