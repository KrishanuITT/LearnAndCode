import { NewsDTO } from "#externalAPIs/DTOs/NewsAPIDTO.js";
import { NewsProvider } from "#externalAPIs/interfaces/NewsProvider.interface.js";
import { TheNewsAPIResponse, TheNewsArticle } from "#externalAPIs/interfaces/TheNewsAPI.interface.js";
import { Logger } from "#utils/Logger.js";

export class TheNewsAPIProvider implements NewsProvider {
  private logger!: Logger;
  constructor(){
    this.logger = new Logger();
  }
  async fetchNews(): Promise<NewsDTO[]> {
    try {
      const raw = await fetchFromNewsAPI();
      if (!Array.isArray(raw.data)) {
        this.logger.warn("Invalid response from TheNewsAPI");
        return [];
      }

      return raw.data.map(
        (item: TheNewsArticle) =>
          new NewsDTO(
            {
              content: item.content,
              description: item.description,
              id: item.url,
              imageUrl: item.image_url,
              publishedAt: item.published_at,
              title: item.title,
              url: item.url,
            },
            this.getName(),
          ),
      );
    } catch (err) {
      this.logger.error(`ERROR: ${JSON.stringify(err)}`);
      return [];
    }
  }

  getName(): string {
    return "The News API";
  }
}

function fetchFromNewsAPI(): Promise<TheNewsAPIResponse> {
  return fetch(`https://api.thenewsapi.com/v1/news/headlines?locale=us&language=en&api_token=${process.env.THE_NEWS_API_KEY ?? ""}`).then(
    (response) => response.json() as unknown as TheNewsAPIResponse,
  );
}
