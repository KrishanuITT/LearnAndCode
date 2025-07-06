/* eslint-disable @typescript-eslint/no-explicit-any */
 

import { CategoriesRepository } from "#categories/categories.repository.js";
import { CategoriesService } from "#categories/categories.service.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("CategoriesService", () => {
  let repo: CategoriesRepository;
  let service: CategoriesService;

  beforeEach(() => {
    repo = {
      findAll: vi.fn(),
      findByName: vi.fn(),
      insert: vi.fn(),
    } as unknown as CategoriesRepository;

    service = new CategoriesService(repo);
  });

  it("should call repo.insert when add is called", () => {
    const name = "Technology";
    void service.add(name);

    expect(repo.insert).toHaveBeenCalledWith(name);
  });

  it("should call repo.findByName and return result", async () => {
    const mockCategory = { id: 1, name: "Sports" };
    (repo.findByName as any).mockResolvedValue(mockCategory);

    const result = await service.findByName("Sports");

    expect(repo.findByName).toHaveBeenCalledWith("Sports");
    expect(result).toBe(mockCategory);
  });

  it("should call repo.findAll and return result", () => {
    const mockCategories = [{ id: 1, name: "Business" }];
    (repo.findAll as any).mockReturnValue(mockCategories);

    const result = service.getAll();

    expect(repo.findAll).toHaveBeenCalled();
    expect(result).toBe(mockCategories);
  });
});
