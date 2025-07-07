/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SearchController } from "../../search/search.controller.js";
import { SearchService } from "../../search/search.service.js";

describe("SearchController", () => {
  let mockService: SearchService;
  let controller: SearchController;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockService = {
      search: vi.fn(),
    } as unknown as SearchService;

    controller = new SearchController(mockService);

    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  it("should return 400 if query is missing", async () => {
    mockReq = {
      body: {
        endDate: "2025-06-30",
        query: "", // missing
        sortBy: "likes",
        startDate: "2025-01-01",
      },
    };

    await controller.searchArticles(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Search query is required" });
  });

  it("should call service.search and return results", async () => {
    const expectedResults = [{ id: 1, title: "News about AI" }];
    mockService.search = vi.fn().mockResolvedValue(expectedResults);

    mockReq = {
      body: {
        endDate: "2025-06-30",
        query: "AI",
        sortBy: "likes",
        startDate: "2025-01-01",
      },
    };

    await controller.searchArticles(mockReq, mockRes);

    expect(mockService.search).toHaveBeenCalledWith("AI", "2025-01-01", "2025-06-30", "likes");
    expect(mockRes.json).toHaveBeenCalledWith(expectedResults);
  });

  it("should handle service failure and return 500", async () => {
    mockService.search = vi.fn().mockRejectedValue(new Error("DB error"));

    mockReq = {
      body: {
        endDate: "2025-06-30",
        query: "politics",
        sortBy: "dislikes",
        startDate: "2025-01-01",
      },
    };

    await controller.searchArticles(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to perform search" });
  });
});
