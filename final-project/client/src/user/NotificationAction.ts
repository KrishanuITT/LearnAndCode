import { IMenuAction } from "../interfaces/IMenuAction.js";
import { Prompt } from "../../utils/prompt.js";
import { SessionStore } from "../../utils/sessionStorage.js";

export class ConfigureNotificationsAction implements IMenuAction {
  label = "Notifications";
  private prompt: Prompt;

  constructor(prompt: Prompt) {
    this.prompt = prompt;
  }

  async execute(): Promise<void> {
    let exit = false;

    while (!exit) {
      console.log("\n Notification Settings");
      console.log("1. View Notifications");
      console.log("2. Configure Notifications");
      console.log("3. Back");
      console.log("4. Logout");

      const choice = await this.prompt.prompt("Select an option (1-4):");

      switch (choice.trim()) {
        case "1":
          await this.viewNotifications();
          break;
        case "2":
          await this.configureNotifications();
          break;
        case "3":
          exit = true;
          break;
        case "4":
          console.log("Logging out...");
        default:
          console.log("Invalid choice. Please try again.");
      }
    }
  }

  private async viewNotifications(): Promise<void> {
    console.log("🔔 Your current notification settings:");

    const userId = SessionStore.getUserId();
    try {
      const response = await fetch(`http://localhost:5000/notifications/user/${userId}`);
      const data = await response.json();

      console.log("\n📂 Category Preferences:");
      data.preferences.forEach((pref: any) => {
        console.log(`- ${pref.category}: ${pref.enabled ? "Enabled" : "Disabled"}`);
      });

      console.log("\n🔍 Keyword Alerts:");
      data.keywords.forEach((keyword: any) => {
        console.log(`- "${keyword.keyword}": ${keyword.enabled ? "Enabled" : "Disabled"}`);
      });

    } catch (err) {
      console.error("Failed to fetch notification settings.", err);
    }
  }

  private async configureNotifications(): Promise<void> {
    const userId = SessionStore.getUserId();

    console.log("\n1. Toggle Category Preferences");
    console.log("2. Add Keywords");
    console.log("3. Back");

    const choice = await this.prompt.prompt("Choose an option (1-3):");

    switch (choice.trim()) {
      case "1": {
        const category = await this.prompt.prompt("Enter category name:");
        const enabled = await this.prompt.prompt("Enable? (yes/no):");
        await fetch("http://localhost:5000/notifications/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            category,
            enabled: enabled.toLowerCase() === "yes"
          })
        });
        console.log("Category preference updated.");
        break;
      }
      case "2": {
        const keywords = await this.prompt.prompt("Enter comma-separated keywords:");
        await fetch("http://localhost:5000/notifications/keywords", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            keywords: keywords.split(",").map(k => k.trim()),
          })
        });
        console.log("Keywords updated.");
        break;
      }
      case "3":
        return;
      default:
        console.log("Invalid choice.");
    }
  }
}
