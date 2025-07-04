  import { NewsDTO } from "./DTOs/NewsAPIDTO.js";
  import { NewsProvider } from "./interfaces/NewsProvider.interface.js";
  import { NewsAPIProvider } from "./providers/NewsAPIProvider.js";
  import { TheNewsAPIProvider } from "./providers/TheNewsAPIProvider.js";

  export class ExternalAPIManager {
    private providers: NewsProvider[] = [];

    constructor() {
      this.providers.push(new TheNewsAPIProvider());
      this.providers.push(new NewsAPIProvider());
    }
    async getAllNews(): Promise<NewsDTO[]> {
      const allNews: NewsDTO[] = [];

      for (const provider of this.providers) {
        const news = await provider.fetchNews();
        allNews.push(...news);
      }

      return allNews;
    }
  }
