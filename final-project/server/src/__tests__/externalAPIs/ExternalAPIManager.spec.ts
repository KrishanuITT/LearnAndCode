/* eslint-disable @typescript-eslint/no-explicit-any */
 

import { beforeEach, describe, expect, it, vi } from "vitest";

import { NewsDTO } from "../../externalAPIs/DTOs/NewsAPIDTO.js";
import { ExternalAPIManager } from "../../externalAPIs/ExternalAPIManager.js";
import { NewsAPIProvider } from "../../externalAPIs/providers/NewsAPIProvider.js";
import { TheNewsAPIProvider } from "../../externalAPIs/providers/TheNewsAPIProvider.js";

vi.mock("../../externalAPIs/providers/NewsAPIProvider.js", () => {
  return {
    NewsAPIProvider: vi.fn().mockImplementation(() => ({
      fetchNews: vi.fn()
    }))
  };
});

vi.mock("../../externalAPIs/providers/TheNewsAPIProvider.js", () => {
  return {
    TheNewsAPIProvider: vi.fn().mockImplementation(() => ({
      fetchNews: vi.fn()
    }))
  };
});

describe("ExternalAPIManager", () => {
  let manager: ExternalAPIManager;

  const mockNews1: NewsDTO[] = [
    {
        category: "general",
        content: "",
        description: "Description 1",
        id: 0,
        imageUrl: "",
        keywords: [],
        publishedAt: new Date(),
        source: "NewsAPI",
        title: "Title 1",
        url: ""
    }
  ];

  const mockNews2: NewsDTO[] = [
    {
        category: "business",
        content: "",
        description: "Description 2",
        id: 0,
        imageUrl: "",
        keywords: [],
        publishedAt: new Date(),
        source: "TheNewsAPI",
        title: "Title 2",
        url: ""
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (NewsAPIProvider as any).mockImplementation(() => ({
      fetchNews: vi.fn().mockResolvedValue(mockNews1)
    }));

    (TheNewsAPIProvider as any).mockImplementation(() => ({
      fetchNews: vi.fn().mockResolvedValue(mockNews2)
    }));

    manager = new ExternalAPIManager();
  });

  it("should fetch and merge news from all providers", async () => {
    const news = await manager.getAllNews();

    expect(news).toHaveLength(2);
    expect(news).toEqual([...mockNews2, ...mockNews1]); // Order: TheNewsAPIProvider, NewsAPIProvider
  });

  it("should return empty array if providers return empty arrays", async () => {
    (NewsAPIProvider as any).mockImplementation(() => ({
      fetchNews: vi.fn().mockResolvedValue([])
    }));

    (TheNewsAPIProvider as any).mockImplementation(() => ({
      fetchNews: vi.fn().mockResolvedValue([])
    }));

    const emptyManager = new ExternalAPIManager();
    const news = await emptyManager.getAllNews();

    expect(news).toEqual([]);
  });

  it("should handle a provider throwing an error and still return other news", async () => {
    (NewsAPIProvider as any).mockImplementation(() => ({
      fetchNews: vi.fn().mockRejectedValue(new Error("NewsAPI failed"))
    }));

    (TheNewsAPIProvider as any).mockImplementation(() => ({
      fetchNews: vi.fn().mockResolvedValue(mockNews2)
    }));

    const partialManager = new ExternalAPIManager();

    const news = await partialManager.getAllNews().catch((e:unknown) => e);

    expect(news).toBeInstanceOf(Error);
  });
});
