import { NewsDTO } from "#externalAPIs/DTOs/NewsAPIDTO.js";
import { NewsAPIProvider } from "#externalAPIs/providers/NewsAPIProvider.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockArticles = [
  {
    author: "John Doe",
    content: "Full content of the article goes here.",
    description: "This is a description of the news article.",
    publishedAt: "2025-07-01T10:00:00Z",
    source: { id: "abc-news", name: "ABC News" },
    title: "Breaking: Important News Headline",
    url: "https://example.com/article1",
    urlToImage: "https://example.com/image.jpg",
  },
];

const mockSourceResponse = {
  sources: [
    {
      category: "general",
      id: "abc-news",
      name: "ABC News",
    },
  ],
  status: "ok",
};

describe("NewsAPIProvider", () => {
  let provider: NewsAPIProvider;

  beforeEach(() => {
    provider = new NewsAPIProvider();
    global.fetch = vi.fn() as typeof fetch;
    vi.clearAllMocks();
  });

  it("should fetch and return NewsDTO[] with categories and keywords", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ articles: mockArticles }),
      }) // fetchFromNewsAPI
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(mockSourceResponse),
      }); // fetchSourceCategories

    const result = await provider.fetchNews();

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(NewsDTO);
    expect(result[0].category).toBe("general");
    expect(result[0].keywords.length).toBeGreaterThan(0);
    expect(result[0].source).toBe("News API");
  });

  it("should return an empty array when fetch fails", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network error"));

    const result = await provider.fetchNews();

    expect(result).toEqual([]);
  });

  it("should correctly extract keywords ignoring stopwords", () => {
    const text = "The quick brown fox jumps over the lazy dog and runs away quickly.";
    const result = provider.extractKeywords(text, 3);

    expect(result).toContain("quick");
    expect(result).toContain("brown");
    expect(result).toContain("jumps");
  });
});
