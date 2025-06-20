import { News } from "./headlines.interface.js";
import { HeadlinesRepository } from "./headlines.repository.js";

export class HeadlinesService {
  constructor(private repo: HeadlinesRepository) {}

  getHeadlinesByDateRange(start: string, end: string, category?: string ): Promise<News[]> {
    return this.repo.fetchHeadlinesByDateRange(start, end, category);
  }

  getTodayHeadlines(): Promise<News[]> {
    return this.repo.fetchTodayHeadlines();
  }
}
