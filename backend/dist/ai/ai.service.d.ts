import { AiProvider } from './interfaces/ai-provider.interface';
import { GenerateTextDto } from './dto/generate-text.dto';
export declare class AiService {
    private readonly aiProvider;
    private readonly logger;
    constructor(aiProvider: AiProvider);
    generateText(dto: GenerateTextDto): Promise<{
        text: string;
        category: string;
        difficulty: string;
    }>;
    getCategories(): string[];
    getDifficulties(): string[];
}
