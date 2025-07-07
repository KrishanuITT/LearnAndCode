import { Prompt } from "../../../utils/prompt.js";
import { IMenuAction } from "../../interfaces/IMenuAction.js";
import { ClientError } from "../../../utils/clientError.js";
import { SessionStore } from "../../../utils/sessionStorage.js";

export class HideKeywordAction implements IMenuAction {
  label = "Hide News Keyword";

  constructor(private prompt: Prompt) {}

  async execute(): Promise<void> {
    try {
      const keyword = this.prompt.prompt("Enter keyword to hide from news: ").trim();

      if (!keyword) {
        throw new ClientError("Keyword cannot be empty.");
      }

      const result = await this.hideKeyword(keyword);
      console.log(`Keyword "${result.keyword ?? keyword}" has been hidden successfully.`);
    } catch (error: unknown) {
      if (error instanceof ClientError) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("Unexpected error occurred:", (error as Error).message);
      }
    }
  }

  private async hideKeyword(keyword: string): Promise<any> {
    try {
      const token = SessionStore.getToken();

      if (!token) {
        throw new ClientError("User is not authenticated. Please log in first.");
      }

      const response = await fetch("http://localhost:5000/admin/filterKeywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ keyword })
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new ClientError(`Server responded with ${response.status}: ${errMsg}`, response.status);
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      throw new ClientError("Network error while hiding keyword.");
    }
  }
}
