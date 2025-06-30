import { Prompt } from "../../../utils/prompt.js";
import { IMenuAction } from "../../interfaces/IMenuAction.js";
import { ClientError } from "../../../utils/clientError.js";
import { SessionStore } from "../../../utils/sessionStorage.js";

export class HideNewsCategoryAction implements IMenuAction {
  label = "Hide News Category";

  constructor(private prompt: Prompt) {}

  async execute(): Promise<void> {
    try {
      const category = this.prompt.prompt("Enter category name to hide: ").trim();

      if (!category) {
        throw new ClientError("Category name cannot be empty.");
      }

      const result = await this.hideCategory(category);
      console.log(result.message);
    } catch (error: unknown) {
      if (error instanceof ClientError) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("Unexpected error occurred:", (error as Error).message);
      }
    }
  }

  private async hideCategory(categoryName: string): Promise<any> {
    try {
      const token = SessionStore.getToken();
  
      if (!token) {
        throw new ClientError("User is not authenticated. Please log in first.");
      }
  
      // Step 1: Get category ID by name
      const categoryRes = await fetch(`http://localhost:5000/categories/name/${encodeURIComponent(categoryName)}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!categoryRes.ok) {
        const msg = await categoryRes.text();
        throw new ClientError(`Failed to find category: ${msg}`, categoryRes.status);
      }
  
      const categoryData = await categoryRes.json();
      const categoryId = categoryData.id;
  
      if (!categoryId) {
        throw new ClientError("Category ID not found.");
      }
  
      // Step 2: Hide the category by ID
      const response = await fetch("http://localhost:5000/admin/hideCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ categoryId, hide: true })
      });
  
      if (!response.ok) {
        const errMsg = await response.text();
        throw new ClientError(`Server responded with ${response.status}: ${errMsg}`, response.status);
      }
  
      return await response.json();
    } catch (error) {
      throw new ClientError("Error while hiding category.");
    }
  }
  
}
