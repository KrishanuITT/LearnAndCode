import { IMenuAction } from "../interfaces/IMenuAction.js";
import { Prompt } from "../../utils/prompt.js";

export class ConfigureNotificationsAction implements IMenuAction {
  label = "Notifications";
  private prompt: Prompt;

  constructor(prompt: Prompt) {
    this.prompt = prompt;
  }

  async execute(): Promise<void> {
    console.log("1. View Notifications\n2. Configure Notifications\n3. Back\n4. Logout");
  }
}
