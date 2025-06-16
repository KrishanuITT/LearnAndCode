import { Prompt } from "./utils/prompt";

class Main{
    private prompter: Prompt;
    constructor(){
        this.prompter = new Prompt();
        const name = this.prompter.prompt("What is your name?:");

        console.log(`Hello ${name}!`);
    }
}

const main = new Main();