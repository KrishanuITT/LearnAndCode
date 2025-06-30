import { Prompt } from "../../../utils/prompt.js";
import { IMenuAction } from "../../interfaces/IMenuAction.js";
import { ClientError } from "../../../utils/clientError.js";

export class AddNewsCategoryAction implements IMenuAction {
  label = "Add new News Category";

  constructor(private prompt: Prompt) {}

  async execute(): Promise<void> {
    try {
      const category = this.prompt.prompt("Enter new category name: ").trim();

      if (!category) {
        throw new ClientError("Category name cannot be empty.");
      }

      const result = await this.addCategory(category);
      console.log("Category added successfully:", result.name ?? result);
    } catch (error: unknown) {
      if (error instanceof ClientError) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("Unexpected error occurred:", (error as Error).message);
      }
    }
  }

  private async addCategory(category: string): Promise<any> {
    try {
      const response = await fetch("http://localhost:5000/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: category })
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new ClientError(`Server responded with ${response.status}: ${errMsg}`, response.status);
      }

      return await response.json();
    } catch (error) {
      throw new ClientError("Network error while adding category.");
    }
  }
}
