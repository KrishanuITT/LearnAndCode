import { IMenuAction } from "../../interfaces/IMenuAction.js";
import { Prompt } from "../../../utils/prompt.js";
import { SessionStore } from "../../../utils/sessionStorage.js";

export class ConfigureNotificationsAction implements IMenuAction {
  label = "Notifications";
  private prompt: Prompt;

  constructor(prompt: Prompt) {
    this.prompt = prompt;
  }

  async execute(): Promise<void> {
    let exit = false;

    while (!exit) {
      console.log("\nNotification Settings");
      console.log("1. View Triggered Notifications");
      console.log("2. View Preferences & Keywords");
      console.log("3. Toggle Category Preference");
      console.log("4. Add or Update Keywords");
      console.log("5. Back");

      const choice = await this.prompt.prompt("Select an option (1-5):");

      switch (choice.trim()) {
        case "1":
          await this.viewTriggeredNotifications();
          break;
        case "2":
          await this.viewPreferencesAndKeywords();
          break;
        case "3":
          await this.toggleCategoryPreference();
          break;
        case "4":
          await this.setKeywords();
          break;
        case "5":
          exit = true;
          break;
        default:
          console.log("Invalid choice. Please try again.");
      }
    }
  }

  private async viewTriggeredNotifications(): Promise<void> {
    const userId = SessionStore.getUserId();
    try {
      const response = await fetch(`http://localhost:5000/notifications/user/${userId}`);
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        console.log("\nNo triggered notifications found.");
        return;
      }

      console.log("\nTriggered Notification Articles:");
      data.forEach((article: any, i: number) => {
        console.log(`\n${i + 1}. ${article.title}`);
        console.log(`   URL: ${article.url}`);
        console.log(`   Category: ${article.category}`);
        console.log(`   Source: ${article.source}`);
        console.log(`   Date: ${new Date(article.created_at).toLocaleString()}`);
      });

      const clear = await this.prompt.prompt("Do you want to clear notifications? (yes/no): ");
      if (clear.toLowerCase() === "yes") {
        await fetch(`http://localhost:5000/notifications/user/${userId}`, { method: "DELETE" });
        console.log("Notifications cleared.");
      } 
    } catch (err) {
      console.error("Failed to fetch triggered notifications:", err);
    }
  }

  private async viewPreferencesAndKeywords(): Promise<void> {
    const userId = SessionStore.getUserId();
  
    let preferences = [];
    let keywords = [];
  
    try {
      const prefRes = await fetch(`http://localhost:5000/notifications/preferences/${userId}`);
      preferences = await prefRes.json();
    } catch (err) {
      console.error("Could not fetch preferences:", err);
    }
  
    try {
      const keywordRes = await fetch(`http://localhost:5000/notifications/keywords/${userId}`);
      keywords = await keywordRes.json();
    } catch (err) {
      console.error("Could not fetch keywords:", err);
    }
  
    console.log("\nCategory Preferences:");
    preferences.forEach((pref: any) => {
      console.log(`- ${pref.category}: ${pref.enabled ? "Enabled" : "Disabled"}`);
    });
  
    console.log("\nKeyword Alerts:");
    keywords.forEach((keyword: any) => {
      console.log(`- "${keyword.keyword}": ${keyword.enabled ? "Enabled" : "Disabled"}`);
    });
  }
  

  private async toggleCategoryPreference(): Promise<void> {
    const userId = SessionStore.getUserId();
    const category = await this.prompt.prompt("Enter category name:");
    const enabled = await this.prompt.prompt("Enable? (yes/no):");
    if (!userId) {
      console.error("User not logged in or session expired.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/notifications/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          category,
          enabled: enabled.toLowerCase() === "yes"
        })
      });
  
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      console.log("Category preference updated.");
    } catch (err) {
      console.error("Failed to update preference:", err);
    }
  }
  

  private async setKeywords(): Promise<void> {
    const userId = SessionStore.getUserId();
    const keywords = await this.prompt.prompt("Enter comma-separated keywords:");

    try {
      const response = await fetch("http://localhost:5000/notifications/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          keywords: keywords.split(",").map(k => k.trim())
        })
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      console.log("Keywords updated successfully.");
    } catch (err) {
      console.error("Failed to update keywords:", err);
    }
  }
}
