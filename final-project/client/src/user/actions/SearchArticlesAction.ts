import { IMenuAction } from "../../interfaces/IMenuAction.js";
import { Prompt } from "../../../utils/prompt.js";

export class SearchArticlesAction implements IMenuAction {
  label = "Search Articles";
  private prompt: Prompt;

  constructor(prompt: Prompt) {
    this.prompt = prompt;
  }

  async execute(): Promise<void> {
    const query = this.prompt.prompt("Enter keyword to search: ").trim();

    if (!query) {
      console.log("Search query cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({startDate:"2025-01-01", endDate:"2025-06-30", sortBy:"likes", query: query })
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const results = await response.json();
      if (results.length === 0) {
        console.log("No articles found.");
        return;
      }

      console.log("\n--- Search Results ---");
      results.forEach((article: any, i: number) => {
        console.log(`${i + 1}. ${article.title}`);
      });
    } catch (err: any) {
      console.error("Search failed:", err.message);
    }
  }
}
