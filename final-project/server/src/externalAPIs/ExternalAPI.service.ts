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

  async saveNewsToDatabase(newsList: NewsDTO[]): Promise<void> {
    await this.repository.bulkSave(newsList);
  }
}
