import { Prompt } from "../../../utils/prompt.js";
import { IMenuAction } from "../../interfaces/IMenuAction.js";
import { SessionStore } from "../../../utils/sessionStorage.js";
import { ClientError } from "../../../utils/clientError.js";

export class ViewAndHideReportedNewsAction implements IMenuAction {
  label = "View & Hide Reported News";

  constructor(private prompt: Prompt) {}

  async execute(): Promise<void> {
    try {
      const token = SessionStore.getToken();

      if (!token) {
        throw new ClientError("Admin token missing. Please login first.");
      }

      const reportedNews = await this.fetchReportedArticles(token);

      if (reportedNews.length === 0) {
        console.log("No reported articles at the moment.");
        return;
      }

      console.log("\nReported Articles:");
      reportedNews.forEach((article: any) => {
        console.log(`\nID: ${article.id}`);
        console.log(`Title: ${article.title}`);
        console.log(`Reports: ${article.report_count}`);
      });

      const input = this.prompt.prompt("\nEnter ID of the article you want to hide (or press Enter to skip): ").trim();

      if (!input) {
        console.log("Skipping hide operation.");
        return;
      }

      const newsId = parseInt(input, 10);
      if (isNaN(newsId)) {
        throw new ClientError("Invalid news ID entered.");
      }

      await this.hideNewsArticle(newsId, token);
      console.log(`Article with ID ${newsId} has been hidden.`);
    } catch (error) {
      if (error instanceof ClientError) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("Unexpected error occurred:", (error as Error).message);
      }
    }
  }

  private async fetchReportedArticles(token: string): Promise<any[]> {
    try {
      const res = await fetch("http://localhost:5000/report/pending", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        const text = await res.text();
        throw new ClientError(`Failed to fetch reported news: ${text}`, res.status);
      }

      return await res.json();
    } catch (err) {
      throw new ClientError("Network error while fetching reported news.");
    }
  }

  private async hideNewsArticle(newsId: number, token: string): Promise<void> {
    try {
      const res = await fetch(`http://localhost:5000/report/hide/${newsId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        const text = await res.text();
        throw new ClientError(`Failed to hide news: ${text}`, res.status);
      }
    } catch (err) {
      throw new ClientError("Network error while hiding article.");
    }
  }
}
