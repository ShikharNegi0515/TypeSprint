import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiProvider } from './interfaces/ai-provider.interface';
import { MockAiProvider } from './providers/mock-ai.provider';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    {
      // Swap MockAiProvider for a real AI provider (e.g. OpenAiProvider) without changing AiService
      provide: AiProvider,
      useClass: MockAiProvider,
    },
  ],
  exports: [AiService],
})
export class AiModule {}
