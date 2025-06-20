import { Authentication } from "./src/auth/Authentication";
import { Prompt } from "./utils/prompt";
import { IMenuAction } from "./src/interfaces/IMenuAction";
import { LoginAction } from "./src/auth/actions/LoginAction";
import { SignupAction } from "./src/auth/actions/SignUpAction";
import { ExitAction } from "./src/auth/actions/ExitAction";
import { AdminPanel } from "./src/admin/AdminPanel";
import { UserPanel } from "./src/user/UserPanel";


class Main {
  private prompter: Prompt;
  private actions: IMenuAction[];
  private shouldExit: boolean;
  private auth: Authentication;
  private adminPanel: AdminPanel;
  private userPanel: UserPanel;

  constructor() {
    this.prompter = new Prompt();
    this.auth = new Authentication(this.prompter);
    this.shouldExit = false;
    this.adminPanel = new AdminPanel(this.prompter);
    this.userPanel  = new UserPanel(this.prompter);

    this.actions = [
      new LoginAction(this.auth),
      new SignupAction(this.auth),
      new ExitAction(() => this.exit())
    ];
  }

  public async run(): Promise<void> {
    while (!this.shouldExit) {
      this.displayMenu();
      await this.handleUserChoice();
    }
  }
  
  
  private displayMenu(): void {
    console.log("\nWelcome to the News Aggregator application.");
    this.actions.forEach((action, index) => {
      console.log(`${index + 1}. ${action.label}`);
    });
  }

  private async handleUserChoice(): Promise<void> {
    const input = this.prompter.prompt("Choose an option: ");
    const index = parseInt(input) - 1;
  
    if (!isNaN(index) && this.actions[index]) {
      const result = await this.actions[index].execute();
      if( result && result.role == "admin"){
        await this.adminPanel.show();
      }
      else if( result && result.role == "user"){
        await this.userPanel.show();
      }
    } else {
      console.log("Invalid option. Please try again.");
    }
  }
  
  
  private exit(): void {
    this.shouldExit = true;
  }
}

(async () => {
  const app = new Main();
  await app.run();
})();
