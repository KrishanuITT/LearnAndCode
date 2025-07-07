/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SavedArticlesRepository } from "../../savedArticles/savedArticles.repository.js";
import { SavedArticlesService } from "../../savedArticles/savedArticles.service.js";

describe("SavedArticlesService", () => {
  let repo: SavedArticlesRepository;
  let service: SavedArticlesService;

  beforeEach(() => {
    repo = {
      deleteArticle: vi.fn(),
      getSavedArticles: vi.fn(),
      saveArticle: vi.fn(),
    } as unknown as SavedArticlesRepository;

    service = new SavedArticlesService(repo);
  });

  it("should delete article by userId and newsId", async () => {
    const mockUserId = 1;
    const mockNewsId = 101;
    (repo.deleteArticle as any).mockResolvedValue(undefined);

    await service.delete(mockUserId, mockNewsId);

    expect(repo.deleteArticle).toHaveBeenCalledWith(mockUserId, mockNewsId);
  });

  it("should get all saved articles for a user", async () => {
    const mockUserId = 2;
    const mockArticles = [{ newsId: 99, title: "Sample" }];
    (repo.getSavedArticles as any).mockResolvedValue(mockArticles);

    const result = await service.getAll(mockUserId);

    expect(repo.getSavedArticles).toHaveBeenCalledWith(mockUserId);
    expect(result).toEqual(mockArticles);
  });

  it("should save article for a user", async () => {
    const mockUserId = 3;
    const mockNewsId = 202;
    (repo.saveArticle as any).mockResolvedValue(undefined);

    await service.save(mockUserId, mockNewsId);

    expect(repo.saveArticle).toHaveBeenCalledWith(mockUserId, mockNewsId);
  });
});
