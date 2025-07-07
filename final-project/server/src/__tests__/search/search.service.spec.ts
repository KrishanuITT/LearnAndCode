import { describe, expect, it, vi } from "vitest";

import { SearchRepository } from "../../search/search.repository.js";
import { SearchService } from "../../search/search.service.js";

describe("SearchService", () => {
  it("should call repo.searchArticles with correct arguments", async () => {
    const mockRepo = {
      searchArticles: vi.fn().mockResolvedValue([{ id: 1, title: "Test Article" }]),
    } as unknown as SearchRepository;

    const service = new SearchService(mockRepo);
    const query = "trump";
    const start = "2024-01-01";
    const end = "2024-12-31";
    const sortBy = "likes";

    const result = await service.search(query, start, end, sortBy);

    expect(mockRepo.searchArticles).toHaveBeenCalledWith(query, start, end, sortBy);
    expect(result).toEqual([{ id: 1, title: "Test Article" }]);
  });

  it("should work without optional parameters", async () => {
    const mockRepo = {
      searchArticles: vi.fn().mockResolvedValue([]),
    } as unknown as SearchRepository;

    const service = new SearchService(mockRepo);
    const result = await service.search("iran");

    expect(mockRepo.searchArticles).toHaveBeenCalledWith("iran", undefined, undefined, undefined);
    expect(result).toEqual([]);
  });
});
