import { Prompt } from "../../utils/prompt.js";
import { IMenuAction } from "../interfaces/IMenuAction.js";

export class AddNewsCategoryAction implements IMenuAction {
  label = "Add new News Category";

  constructor(private prompt: Prompt) {}

  async execute(): Promise<void> {
    try {
      const category = this.prompt.prompt("Enter new category name: ").trim();

      if (!category) {
        console.log("Category name cannot be empty.");
        return;
      }

      const result = await this.addCategory(category);
      console.log("Category added successfully:", result);
    } catch (error: any) {
      console.error("Failed to add category:", error.message || error);
    }
  }

  private async addCategory(category: string): Promise<any> {
    const response = await fetch("http://localhost:5000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: category })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }
}
