/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { CategoriesController } from "#categories/categories.controller.js";
import { CategoriesService } from "#categories/categories.service.js";
import { AppError } from "#utils/AppError.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("CategoriesController", () => {
  let service: CategoriesService;
  let controller: CategoriesController;
  let req: any;
  let res: any;

  const mockStatus = vi.fn();
  const mockJson = vi.fn();

  beforeEach(() => {
    service = {
      add: vi.fn(),
      findByName: vi.fn(),
      getAll: vi.fn(),
    } as unknown as CategoriesService;

    controller = new CategoriesController(service);

    req = { body: {}, params: {} };
    res = {
      json: mockJson,
      status: mockStatus.mockReturnValue({ json: mockJson }),
    };

    vi.clearAllMocks();
  });

  describe("addCategory", () => {
    it("should add a category and return 201", async () => {
      req.body.name = "Technology";
      const mockCategory = { id: 1, name: "Technology" };
      (service.add as any).mockResolvedValue(mockCategory);

      await controller.addCategory(req, res);

      expect(service.add).toHaveBeenCalledWith("Technology");
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockCategory);
    });

    it("should return 400 if name is missing", async () => {
      req.body.name = "";

      const spy = vi.spyOn(AppError.prototype, "handle");

      await controller.addCategory(req, res);

      expect(spy).toHaveBeenCalledWith(res);
    });
  });

  describe("getAllCategories", () => {
    it("should return all categories", async () => {
      const categories = [{ id: 1, name: "Business" }];
      (service.getAll as any).mockResolvedValue(categories);

      await controller.getAllCategories(req, res);

      expect(service.getAll).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(categories);
    });
  });

  describe("getCategoryByName", () => {
    it("should return a category if found", async () => {
      req.params.name = "Health";
      const category = { id: 2, name: "Health" };
      (service.findByName as any).mockResolvedValue(category);

      await controller.getCategoryByName(req, res);

      expect(service.findByName).toHaveBeenCalledWith("Health");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(category);
    });

    it("should return 404 if category is not found", async () => {
      req.params.name = "Nonexistent";
      (service.findByName as any).mockResolvedValue(null);

      const spy = vi.spyOn(AppError.prototype, "handle");

      await controller.getCategoryByName(req, res);

      expect(spy).toHaveBeenCalledWith(res);
    });

    it("should return 400 if name param is missing", async () => {
      req.params.name = undefined;

      const spy = vi.spyOn(AppError.prototype, "handle");

      await controller.getCategoryByName(req, res);

      expect(spy).toHaveBeenCalledWith(res);
    });
  });
});
