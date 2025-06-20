import { IMenuAction } from "../interfaces/IMenuAction.js";
import { Prompt } from "../../utils/prompt.js";
import { SessionStore } from "../../utils/sessionStorage.js";

export class ViewHeadlinesAction implements IMenuAction {
  label = "View Headlines";
  private prompt: Prompt;

  constructor(prompt: Prompt) {
    this.prompt = prompt;
  }

  async execute(): Promise<void> {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    const formattedTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });

    console.log(`\nWelcome to the News Application, Suresh! Date: ${formattedDate}`);
    console.log(`Time: ${formattedTime}`);
    console.log("Please choose the options below");
    console.log("1. Today");
    console.log("2. Date range");
    console.log("3. Logout");

    const mode = parseInt(this.prompt.prompt("Enter your choice: "), 10);
    let startDate = "", endDate = "", category = "all";

    if (mode === 3) {
      console.log("Logging out...");
      return;
    }

    if (mode === 1) {
      await this.fetchTodayHeadlines();
    } else if (mode === 2) {
      startDate = this.prompt.prompt("Enter start date (YYYY-MM-DD): ");
      endDate = this.prompt.prompt("Enter end date (YYYY-MM-DD): ");

      console.log("\nChoose category:");
      const categories = ["All", "Business", "Entertainment", "Sports", "Technology"];
      categories.forEach((cat, i) => console.log(`${i + 1}. ${cat}`));

      const catChoice = parseInt(this.prompt.prompt("Category number: "), 10);
      if (catChoice < 1 || catChoice > categories.length) {
        console.log("Invalid category. Defaulting to All.");
        category = "all";
      } else {
        category = categories[catChoice - 1].toLowerCase();
      }

      await this.fetchHeadlinesByDateRange(startDate, endDate, category);
    } else {
      console.log("Invalid choice.");
    }
  }

  private async fetchTodayHeadlines(): Promise<void> {
    try {
      const response = await fetch("http://localhost:5000/headlines/today");
      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const articles = await response.json();
      this.displayArticles(articles);
    } catch (err: any) {
      console.error("Failed to fetch today's headlines:", err.message);
    }
  }

  private async fetchHeadlinesByDateRange(startDate: string, endDate: string, category: string): Promise<void> {
    try {
      const response = await fetch("http://localhost:5000/headlines/range", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ startDate, endDate, category })
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const articles = await response.json();
      this.displayArticles(articles);
    } catch (err: any) {
      console.error("Failed to fetch headlines for date range:", err.message);
    }
  }

  private displayArticles(articles: any[]): void {
    if (!articles || articles.length === 0) {
      console.log("No articles found.");
      return;
    }

    console.log("\nH E A D L I N E S");
    articles.forEach((article: any, i: number) => {
      console.log(`\nArticle Id: ${article.id}`);
      console.log(`${article.title}`);
      console.log(`${article.description?.slice(0, 200) ?? "No description."}`);
      console.log(`source: ${article.source}`);
      console.log(`URL: ${article.url}`);
      console.log(`Category: ${article.category}\n`);
    });

    const choice = parseInt(this.prompt.prompt("Options:\n1. Back\n2. Logout\n3. Save Article\nYour choice: "), 10);
    if (choice === 3) {
      const articleId = this.prompt.prompt("Enter Article ID to save: ")
      console.log("Saving Article ID:", articleId);
      this.saveArticle(articleId);
    } else if (choice === 2) {
      console.log("Logging out...");
    }

  }

  private async saveArticle(newsId: string): Promise<void> {
    try {
      const response = await fetch("http://localhost:5000/saved-articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
body: JSON.stringify({ userId:  SessionStore.getUserId(), newsId })
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const result = await response.json();
      console.log("Article saved:", result.message || "Success");
    } catch (err: any) {
      console.error("Failed to save article:", err.message);
    }
  }
}
