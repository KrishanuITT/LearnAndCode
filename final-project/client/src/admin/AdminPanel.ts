import { Prompt } from "../../utils/prompt.js";
import { IMenuAction } from "../interfaces/IMenuAction.js";
import { AddNewsCategoryAction } from "./AddNewsCategoryAction.js";
import { EditServerDetailsAction } from "./EditServerDetailsAction.js";
import { LogoutAction } from "./LogoutAction.js";
import { ViewServerDetailsAction } from "./ViewServerDetailsAction.js";
import { ViewServerListAction } from "./ViewServerListAction.js";

export class AdminPanel {
  private actions: IMenuAction[];
  private back = false;

  constructor(private prompt: Prompt) {
    const logoutCallback = () => {
      this.back = true;
    };

    this.actions = [
      new ViewServerListAction(),
      new ViewServerDetailsAction(),
      new EditServerDetailsAction(),
      new AddNewsCategoryAction(prompt),
      new LogoutAction(logoutCallback)
    ];
  }

  public async show(): Promise<void> {
    this.back = false;

    while (!this.back) {
      console.log("\n Admin Panel");
      this.actions.forEach((action, index) => {
        console.log(`${index + 1}. ${action.label}`);
      });

      const choice = parseInt(this.prompt.prompt("Choose an option: "), 10);

      if (choice >= 1 && choice <= this.actions.length) {
        const selectedAction = this.actions[choice - 1];
        await selectedAction.execute();
      } else {
        console.log("Invalid option. Please try again.");
      }
    }
  }
}
