import { ExternalServerDTO } from "./DTOs/ExternalServerDTO.js";
import { NewsDTO } from "./DTOs/NewsAPIDTO.js";
import { ExternalAPIRepository } from "./ExternalAPI.repository.js";
import { ExternalAPIManager } from "./ExternalAPIManager.js";
export class ExternalAPIService {
  constructor(
    private manager: ExternalAPIManager,
    private repository: ExternalAPIRepository,
  ) {}

  async fetchAllNews(): Promise<NewsDTO[]> {
    return await this.manager.getAllNews();
  }

  async listAllServers(): Promise<ExternalServerDTO[]> {
    return await this.repository.listAllServers();
  }

  async saveNewsToDatabase(newsList: NewsDTO[]): Promise<void> {
    await this.repository.bulkSave(newsList);
  }

  async updateServer(id: string, key: string): Promise<ExternalServerDTO> {
    return await this.repository.updateServer(id, key);
  }
}
