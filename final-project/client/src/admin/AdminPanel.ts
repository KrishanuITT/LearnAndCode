import { Prompt } from "../../utils/prompt.js";
import { IMenuAction } from "../interfaces/IMenuAction.js";
import { AddNewsCategoryAction } from "./actions/AddNewsCategoryAction.js";
import { EditServerDetailsAction } from "./actions/EditServerDetailsAction.js";
import { LogoutAction } from "./actions/LogoutAction.js";
import { ViewServerDetailsAction } from "./actions/ViewServerDetailsAction.js";
import { ViewServerListAction } from "./actions/ViewServerListAction.js";
import { HideNewsCategoryAction } from "./actions/HideCategoryAction.js";
import { HideKeywordAction } from "./actions/HideKeywordAction.js";
import { ViewAndHideReportedNewsAction } from "./actions/ViewAndHideReportedNewsAction.js";

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
      new HideKeywordAction(prompt),
      new HideNewsCategoryAction(prompt),
      new ViewAndHideReportedNewsAction(prompt),
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
