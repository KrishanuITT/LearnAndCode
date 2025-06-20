import { IMenuAction } from "../interfaces/IMenuAction";

export class ViewServerListAction implements IMenuAction {
  label = "View the list of external servers and status";

  async execute(): Promise<void> {
    try {
      const serverData = await this.fetchData();

      if (!Array.isArray(serverData) || serverData.length === 0) {
        console.log("No external servers found.");
        return;
      }

      console.log("\nList of External Servers:\n");
      serverData.forEach((server: any, index: number) => {
        console.log(`${index + 1}. ${server.name} - ${server.isActive ? "Active" : "Inactive"} - last accessed: ${server.lastAccessed}`);
      });
    } catch (error) {
      console.error("Failed to fetch external server list:", error);
    }
  }

  private async fetchData(): Promise<any[]> {
    const response = await fetch("http://localhost:5000/external-api/list");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }
}
