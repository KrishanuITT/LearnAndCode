import { AdminRepository } from "#admin/admin.repository.js";
import { AdminService } from "#admin/admin.service.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("AdminService", () => {
  let repository: AdminRepository;
  let service: AdminService;

  beforeEach(() => {
    repository = {
      addKeyword: vi.fn(),
      deleteKeyword: vi.fn(),
      getAllKeywords: vi.fn(),
      updateQueryStatus: vi.fn(),
    } as unknown as AdminRepository;

    service = new AdminService(repository);
    vi.clearAllMocks();
  });

  it("should call repository.addKeyword when addKeywords is invoked", async () => {
    const keyword = "breaking";
    await service.addKeywords(keyword);
    expect(repository.addKeyword).toHaveBeenCalledWith(keyword);
  });

  it("should call repository.getAllKeywords when getAllKeywords is invoked", () => {
    void service.getAllKeywords();
    expect(repository.getAllKeywords).toHaveBeenCalled();
  });

  it("should call repository.deleteKeyword when removeKeywords is invoked", async () => {
    const keyword = "sports";
    await service.removeKeywords(keyword);
    expect(repository.deleteKeyword).toHaveBeenCalledWith(keyword);
  });

  it("should call repository.updateQueryStatus with correct arguments", () => {
    const hide = true;
    const categoryId = 3;
    void service.updateQueryStatus(hide, categoryId);
    expect(repository.updateQueryStatus).toHaveBeenCalledWith(hide, categoryId);
  });
});
