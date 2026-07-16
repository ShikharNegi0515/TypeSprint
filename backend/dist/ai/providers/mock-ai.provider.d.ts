import { AiProvider } from '../interfaces/ai-provider.interface';
export declare class MockAiProvider extends AiProvider {
    generateText(category: string, difficulty: string): Promise<string>;
}
