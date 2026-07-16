export abstract class AiProvider {
  abstract generateText(category: string, difficulty: string): Promise<string>;
}
