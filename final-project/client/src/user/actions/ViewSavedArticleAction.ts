import { SessionStore } from "../../../utils/sessionStorage.js";
import { IMenuAction } from "../../interfaces/IMenuAction.js";

export class ViewSavedArticlesAction implements IMenuAction {
  label = "View Saved Articles";

  async execute(): Promise<void> {
    try {
      const response = await fetch(`http://localhost:5000/saved-articles/${SessionStore.getUserId()}`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const saved = await response.json();

      console.log("\n--- Your Saved Articles ---");
      if (saved.length === 0) {
        console.log("No saved articles found.");
        return;
      }

      saved.forEach((article: any, i: number) => {
        console.log(`${i + 1}. ${article.title}`);
      });
    } catch (err: any) {
      console.error("Failed to load saved articles:", err.message);
    }
  }
}
