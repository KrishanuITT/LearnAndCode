import { Prompt } from "../../utils/prompt.js";
import { IMenuAction } from "../interfaces/IMenuAction.js";
import { ViewHeadlinesAction } from "./ViewHeadlinesAction.js";
import { ViewSavedArticlesAction } from "./ViewSavedArticleAction.js";
import { SearchArticlesAction } from "./SearchArticlesAction.js";
import { ConfigureNotificationsAction } from "./ConfigureNotificationAction.js";
import { LogoutAction } from "../admin/LogoutAction.js";

export class UserPanel {
  private actions: IMenuAction[];
  private back = false;

  constructor(private prompt: Prompt) {
    const logoutCallback = () => {
      this.back = true;
    };

    this.actions = [
      new ViewHeadlinesAction(this.prompt),
      new ViewSavedArticlesAction(),
      new SearchArticlesAction(this.prompt),
      new ConfigureNotificationsAction(this.prompt),
      new LogoutAction(logoutCallback)
    ];
  }

  public async show(): Promise<void> {
    this.back = false;

    while (!this.back) {
      console.log("\n User Panel");
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
