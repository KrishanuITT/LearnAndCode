/* eslint-disable @typescript-eslint/no-explicit-any */

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { News } from "../../headlines/headlines.interface.js";

import { HeadlinesRepository } from "../../headlines/headlines.repository.js";
import { HeadlinesService } from "../../headlines/headlines.service.js";

describe("HeadlinesService", () => {
  let repo: HeadlinesRepository;
  let service: HeadlinesService;

  const sampleNews: News[] = [
    {
      category: "Technology",
      id: 1,
      preview: "",
      publishedAt: "2025-07-04T10:00:00Z",
      source: "",
      title: "Tech News",
      url: "",
    },
    {
      category: "Business",
      id: 2,
      preview: "",
      publishedAt: "2025-07-05T10:00:00Z",
      source: "",
      title: "Business Growth",
      url: "",
    },
  ];

  beforeEach(() => {
    repo = {
      fetchHeadlinesByDateRange: vi.fn(),
      fetchPersonalizedNews: vi.fn(),
      fetchTodayHeadlines: vi.fn(),
    } as unknown as HeadlinesRepository;

    service = new HeadlinesService(repo);
    vi.clearAllMocks();
  });

  describe("getHeadlinesByDateRange", () => {
    it("should return personalized filtered news if available", async () => {
      const personalized = [
        {
          category: "Business",
          content: "New startups emerging.",
          id: 3,
          publishedAt: "2025-07-05T12:00:00Z",
          title: "Startup Boom",
        },
      ];

      (repo.fetchPersonalizedNews as any).mockResolvedValue(personalized);
      (repo.fetchHeadlinesByDateRange as any).mockResolvedValue(sampleNews);

      const result = await service.getHeadlinesByDateRange("2025-07-01", "2025-07-06", "business", 1);

      expect(result).toEqual(personalized);
    });

    it("should fallback to allNews if personalized is empty", async () => {
      (repo.fetchPersonalizedNews as any).mockResolvedValue([]);
      (repo.fetchHeadlinesByDateRange as any).mockResolvedValue(sampleNews);

      const result = await service.getHeadlinesByDateRange("2025-07-01", "2025-07-06", "technology", 2);

      expect(result).toEqual(sampleNews);
    });

    it("should filter personalized by date and category", async () => {
      const personalized = [
        {
          category: "Business",
          content: "Too old news",
          id: 4,
          publishedAt: "2025-06-01T10:00:00Z",
          title: "Outside Range",
        },
        {
          category: "Health",
          content: "Different topic",
          id: 5,
          publishedAt: "2025-07-05T10:00:00Z",
          title: "Wrong Category",
        },
      ];

      (repo.fetchPersonalizedNews as any).mockResolvedValue(personalized);
      (repo.fetchHeadlinesByDateRange as any).mockResolvedValue(sampleNews);

      const result = await service.getHeadlinesByDateRange("2025-07-01", "2025-07-06", "business", 3);

      expect(result).toEqual(sampleNews);
    });
  });

  describe("getTodayHeadlines", () => {
    it("should return personalized headlines if available", async () => {
      const personalized = [sampleNews[0]];

      (repo.fetchPersonalizedNews as any).mockResolvedValue(personalized);

      const result = await service.getTodayHeadlines(10);

      expect(result).toEqual(personalized);
    });

    it("should return general headlines if personalized is empty", async () => {
      (repo.fetchPersonalizedNews as any).mockResolvedValue([]);
      (repo.fetchTodayHeadlines as any).mockResolvedValue(sampleNews);

      const result = await service.getTodayHeadlines(10);

      expect(result).toEqual(sampleNews);
    });
  });
});
