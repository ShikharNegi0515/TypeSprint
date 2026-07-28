import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { GenerateTextDto } from './dto/generate-text.dto';

@ApiTags('ai')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('generate')
  @ApiOperation({
    summary: 'Generate an AI typing text by category and difficulty',
  })
  generate(@Query() dto: GenerateTextDto) {
    return this.aiService.generateText(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get available text categories' })
  getCategories() {
    return { categories: this.aiService.getCategories() };
  }

  @Get('difficulties')
  @ApiOperation({ summary: 'Get available difficulty levels' })
  getDifficulties() {
    return { difficulties: this.aiService.getDifficulties() };
  }
}
