import { NewsDTO } from "#externalAPIs/DTOs/NewsAPIDTO.js";
import { NewsAPIArticle, NewsAPIResponse } from "#externalAPIs/interfaces/NewsAPI.interface.js";
import { NewsAPISourceResponse } from "#externalAPIs/interfaces/NewsAPISource.interface.js";
import { NewsProvider } from "#externalAPIs/interfaces/NewsProvider.interface.js";
import { Logger } from "#utils/Logger.js";

export class NewsAPIProvider implements NewsProvider {
  private logger!: Logger;

  constructor() {
    this.logger = new Logger();
  }

  extractKeywords(text: string, max = 5): string[] {
    const stopwords = new Set([
      "about", "after", "and", "are", "for", "from", "has", "have", "that", "the", "this", "was", "will", "with",
    ]);
    const words = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3 && !stopwords.has(word));

    const frequency: Record<string, number> = {};
    for (const word of words) {
      frequency[word] = (frequency[word] || 0) + 1;
    }

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, max)
      .map(([word]) => word);
  }

  async fetchNews(): Promise<NewsDTO[]> {
    try {
      const [newsData, sourceCategoryMap] = await Promise.all([
        fetchFromNewsAPI(),
        fetchSourceCategories(),
      ]);

      return newsData.articles.map((item: NewsAPIArticle) => {
        const combinedText = `${item.title} ${item.description} ${item.content}`;
        const keywords = this.extractKeywords(combinedText);
        const sourceId = item.source.id;
        const category = sourceCategoryMap[sourceId];
        return new NewsDTO(
          {
            category,
            content: item.content,
            description: item.description,
            id: item.url,
            imageUrl: item.urlToImage,
            keywords,
            publishedAt: item.publishedAt,
            title: item.title,
            url: item.url,
          },
          this.getName()
        );
      });
    } catch (err) {
      this.logger.error(`ERROR: ${JSON.stringify(err)}`);
      return [];
    }
  }

  getName(): string {
    return "News API";
  }
}

function fetchFromNewsAPI(): Promise<NewsAPIResponse> {
  return fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY ?? ""}`)
    .then((response) => response.json() as unknown as NewsAPIResponse);
}

async function fetchSourceCategories(): Promise<Record<string, string>> {
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines/sources?apiKey=${process.env.NEWS_API_KEY ?? ""}`
  );

  const data = (await response.json()) as NewsAPISourceResponse;

  const map: Record<string, string> = {};
  if (data.status === "ok" && Array.isArray(data.sources)) {
    for (const source of data.sources) {
      if (source.id && source.category) {
        map[source.id] = source.category;
      }
    }
  }

  return map;
}

