import { AiService } from './ai.service';
import { GenerateTextDto } from './dto/generate-text.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generate(dto: GenerateTextDto): Promise<{
        text: string;
        category: string;
        difficulty: string;
    }>;
    getCategories(): {
        categories: string[];
    };
    getDifficulties(): {
        difficulties: string[];
    };
}
