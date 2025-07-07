import { IMenuAction } from "../../interfaces/IMenuAction.js";
import { Prompt } from "../../../utils/prompt.js";
import { SessionStore } from "../../../utils/sessionStorage.js";
import fetch from "node-fetch";

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

    console.log(`\nWelcome to the News Application! Date: ${formattedDate}`);
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
      category = (catChoice >= 1 && catChoice <= categories.length)
        ? categories[catChoice - 1].toLowerCase()
        : "all";

      await this.fetchHeadlinesByDateRange(startDate, endDate, category);
    } else {
      console.log("Invalid choice.");
    }
  }

  private async fetchTodayHeadlines(): Promise<void> {
    try {
      const token = SessionStore.getToken();
      const response = await fetch("http://127.0.0.1:5000/headlines/today", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const articles = await response.json() as any[];
      await this.displayArticles(articles);
    } catch (err: any) {
      console.error("Failed to fetch today's headlines:", err.message);
    }
  }

  private async fetchHeadlinesByDateRange(startDate: string, endDate: string, category: string): Promise<void> {
    try {
      const token = SessionStore.getToken();
      const response = await fetch("http://127.0.0.1:5000/headlines/range", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ startDate, endDate, category })
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const articles = await response.json() as any[];
      await this.displayArticles(articles);
    } catch (err: any) {
      console.error("Failed to fetch headlines for date range:", err.message);
    }
  }

  private async displayArticles(articles: any[]): Promise<void> {
    if (!articles || articles.length === 0) {
      console.log("No articles found.");
      return;
    }

    console.log("\nH E A D L I N E S");
    articles.forEach((article: any) => {
      console.log(`\nArticle Id: ${article.id}`);
      console.log(`${article.title}`);
      console.log(`${article.description?.slice(0, 200) ?? "No description."}`);
      console.log(`source: ${article.source}`);
      console.log(`URL: ${article.url}`);
      console.log(`Category: ${article.category}\n`);
    });

    let stayInLoop = true;

    while (stayInLoop) {
      const choice = parseInt(
        this.prompt.prompt(
          `Options:
          1. Back
          2. Logout
          3. Save Article
          4. Report Article
          5. Like Article
          Your choice: `
        ),
        10
      );

      switch (choice) {
        case 1:
          stayInLoop = false;
          break;
        case 2:
          console.log("Logging out...");
          process.exit(0);
        case 3: {
          const articleId = this.prompt.prompt("Enter Article ID to save: ");
          await this.saveArticle(articleId);
          break;
        }
        case 4: {
          const articleId = this.prompt.prompt("Enter Article ID to report: ");
          await this.reportArticle(articleId);
          break;
        }
        case 5: {
          const articleId = this.prompt.prompt("Enter Article ID to like: ");
          await this.likeArticle(articleId);
          break;
        }
        default:
          console.log("Invalid choice.");
      }
    }
  }

  private async reportArticle(newsId: string): Promise<void> {
    try {
      const token = SessionStore.getToken();
      const response = await fetch("http://127.0.0.1:5000/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newsId })
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const result = await response.json() as any;
      console.log("Article reported:", result.message || "Success");
    } catch (err: any) {
      console.error("Failed to report article:", err.message);
    }
  }

  private async saveArticle(newsId: string): Promise<void> {
    try {
      const response = await fetch("http://127.0.0.1:5000/saved-articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: SessionStore.getUserId(), newsId })
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const result = await response.json() as any;
      console.log("Article saved:", result.message || "Success");
    } catch (err: any) {
      console.error("Failed to save article:", err.message);
    }
  }

  private async likeArticle(newsId: string): Promise<void> {
    try {
      const token = SessionStore.getToken();
      const response = await fetch("http://127.0.0.1:5000/saved-articles/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newsId, isLike: true })
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const result = await response.json() as any;
      console.log("Article liked:", result.message || "Success");
    } catch (err: any) {
      console.error("Failed to like article:", err.message);
    }
  }
}
