import { beforeEach, describe, expect, it, vi } from "vitest";

import { ExternalServerDTO } from "../../externalAPIs/DTOs/ExternalServerDTO.js";
import { NewsDTO } from "../../externalAPIs/DTOs/NewsAPIDTO.js";
import { ExternalAPIRepository } from "../../externalAPIs/ExternalAPI.repository.js";
import { ExternalAPIService } from "../../externalAPIs/ExternalAPI.service.js";
import { ExternalAPIManager } from "../../externalAPIs/ExternalAPIManager.js";

describe("ExternalAPIService", () => {
  let service: ExternalAPIService;
  let mockManager: ExternalAPIManager;
  let mockRepository: ExternalAPIRepository;

  const mockNews: NewsDTO[] = [
    {
      category: "general",
      content: "",
      description: "Mock description",
      id: 0,
      imageUrl: "",
      keywords: [],
      publishedAt: new Date(),
      source: "MockAPI",
      title: "Mock News Title",
      url: "",
    },
  ];

  const mockServers: ExternalServerDTO[] = [
    {
      apiKey: "key123",
      id: 1,
      isActive: true,
      lastAccessed: null,
      name: "Server A",
    },
    {
      apiKey: "key456",
      id: 2,
      isActive: false,
      lastAccessed: null,
      name: "Server B",
    },
  ];

  beforeEach(() => {
    mockManager = {
      getAllNews: vi.fn().mockResolvedValue(mockNews),
    } as unknown as ExternalAPIManager;

    mockRepository = {
      bulkSave: vi.fn().mockResolvedValue(undefined),
      listAllServers: vi.fn().mockResolvedValue(mockServers),
      updateServer: vi.fn().mockResolvedValue(mockServers[0]),
    } as unknown as ExternalAPIRepository;

    service = new ExternalAPIService(mockManager, mockRepository);
  });

  it("should fetch all news from manager", async () => {
    const result = await service.fetchAllNews();
    expect(result).toEqual(mockNews);
    expect(mockManager.getAllNews).toHaveBeenCalled();
  });

  it("should list all external servers", async () => {
    const result = await service.listAllServers();
    expect(result).toEqual(mockServers);
    expect(mockRepository.listAllServers).toHaveBeenCalled();
  });

  it("should save news to the database", async () => {
    await service.saveNewsToDatabase(mockNews);
    expect(mockRepository.bulkSave).toHaveBeenCalledWith(mockNews);
  });

  it("should update a server record", async () => {
    const updated = await service.updateServer("1", "newKey");
    expect(updated).toEqual(mockServers[0]);
    expect(mockRepository.updateServer).toHaveBeenCalledWith("1", "newKey");
  });
});
