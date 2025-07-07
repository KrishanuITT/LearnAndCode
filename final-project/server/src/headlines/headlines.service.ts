import { News } from "./headlines.interface.js";
import { HeadlinesRepository } from "./headlines.repository.js";

export class HeadlinesService {
  constructor(private repository: HeadlinesRepository) {}

  async getHeadlinesByDateRange(start: string, end: string, category: string, userId: number): Promise<News[]> {
    const allNews = await this.repository.fetchHeadlinesByDateRange(start, end, category);
    const personalized = await this.repository.fetchPersonalizedNews(userId);

    const personalizedFiltered = personalized.filter((article) => {
      const publishedAt = new Date(article.publishedAt);
      const inDateRange = publishedAt >= new Date(start) && publishedAt <= new Date(end);
      const matchesCategory = !category || article.category.toLowerCase() === category.toLowerCase();
      return inDateRange && matchesCategory;
    });

    return personalizedFiltered.length > 0 ? personalizedFiltered : allNews;
  }

  async getTodayHeadlines(userId: number): Promise<News[]> {
    const personalized = await this.repository.fetchPersonalizedNews(userId);
    if (personalized.length === 0) {
      return this.repository.fetchTodayHeadlines();
    }
    return personalized;
  }
}
