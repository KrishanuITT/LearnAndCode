import prompts, { PromptObject } from 'prompts';
import { IUserInput } from './Interfaces';

export class UserInput {
  async getUserInput(): Promise<IUserInput> {
    const questions: PromptObject[] = [
      { type: "text", name: "blogName", message: "Enter the Tumblr blog name:" },
      { type: "text", name: "range", message: "Enter the post range (e.g., 1-5):" }
    ];

    const { blogName, range } = await prompts(questions);
    const [startPost, endPost] = range.split("-").map(Number);

    if (isNaN(startPost) || isNaN(endPost) || startPost < 0 || endPost < startPost) {
      throw new Error("Invalid post range. Please enter a valid range (e.g., 1-5).");
    }

    return { blogName, startPost, endPost };
  }
}
