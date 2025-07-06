/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SavedArticlesController } from "../../savedArticles/savedArticles.controller.js";
import { SavedArticlesService } from "../../savedArticles/savedArticles.service.js";

describe("SavedArticlesController", () => {
  let service: SavedArticlesService;
  let controller: SavedArticlesController;
  let mockRes: any;

  beforeEach(() => {
    service = {
      delete: vi.fn(),
      getAll: vi.fn(),
      save: vi.fn(),
    } as unknown as SavedArticlesService;

    controller = new SavedArticlesController(service);

    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  describe("saveArticle", () => {
    it("should save article and return 201", async () => {
      const mockReq = { body: { newsId: 10, userId: 1 } };

      await controller.saveArticle(mockReq as any, mockRes);

      expect(service.save).toHaveBeenCalledWith(1, 10);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Article saved." });
    });

    it("should return 500 on error", async () => {
      vi.spyOn(service, "save").mockRejectedValueOnce(new Error("Save failed"));
      const mockReq = { body: { newsId: 10, userId: 1 } };

      await controller.saveArticle(mockReq as any, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to save article." });
    });
  });

  describe("deleteArticle", () => {
    it("should delete article and return 200", async () => {
      const mockReq = { body: { newsId: 99, userId: 2 } };

      await controller.deleteArticle(mockReq as any, mockRes);

      expect(service.delete).toHaveBeenCalledWith(2, 99);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Article deleted." });
    });

    it("should return 500 on delete error", async () => {
      vi.spyOn(service, "delete").mockRejectedValueOnce(new Error("Delete failed"));
      const mockReq = { body: { newsId: 99, userId: 2 } };

      await controller.deleteArticle(mockReq as any, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to delete article." });
    });
  });

  describe("getSavedArticles", () => {
    it("should return articles for user", async () => {
      const mockArticles = [{ title: "Article 1" }, { title: "Article 2" }];
      vi.spyOn(service, "getAll").mockResolvedValueOnce(mockArticles);
      const mockReq = { params: { userId: "3" } };

      await controller.getSavedArticles(mockReq as any, mockRes);

      expect(service.getAll).toHaveBeenCalledWith(3);
      expect(mockRes.json).toHaveBeenCalledWith(mockArticles);
    });

    it("should return 500 on fetch error", async () => {
      vi.spyOn(service, "getAll").mockRejectedValueOnce(new Error("DB error"));
      const mockReq = { params: { userId: "3" } };

      await controller.getSavedArticles(mockReq as any, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to fetch saved articles." });
    });
  });
});
