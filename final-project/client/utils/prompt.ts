import promptSync from "prompt-sync";

export class Prompt {
    private input: (question: string) => string;

    constructor() {
        this.input = promptSync();
    }

    prompt(question: string): string {
        return this.input(question);
    }
}