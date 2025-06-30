import { IMenuAction } from "../../interfaces/IMenuAction";
import { Prompt } from "../../../utils/prompt.js";

export class EditServerDetailsAction implements IMenuAction {
  label = "Update/Edit external server's details";
  private prompt: Prompt;

  constructor() {
    this.prompt = new Prompt();
  }

  async execute(): Promise<void> {
    try {
        const serverData = await this.fetchData();

        if (!Array.isArray(serverData) || serverData.length === 0) {
          console.log("No external servers found.");
          return;
        }
  
        console.log("\nList of External Servers:\n");
        serverData.forEach((server: any, index: number) => {
          console.log(`${index + 1}. ${server.name} - ${server.apiKey}`);
        });
      const serverId = this.prompt.prompt("Enter the Server ID to edit: ").trim();

      if (!serverId) {
        console.log("Server ID cannot be empty.");
        return;
      }

      const newValue = this.prompt.prompt(`Enter the new value for key: `).trim();

      const result = await this.updateServer(serverId, newValue);
      console.log("Server updated successfully:", result);
    } catch (error: any) {
      console.error("Error updating server:", error.message || error);
    }
  }

  private async fetchData(): Promise<any[]> {
    const response = await fetch("http://localhost:5000/external-api/list");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }

  private async updateServer(id: string, key: string): Promise<any> {
    const response = await fetch("http://localhost:5000/external-api/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({id,key})
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }
}
