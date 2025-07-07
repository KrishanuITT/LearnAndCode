import { NewsDTO } from "#externalAPIs/DTOs/NewsAPIDTO.js";
import { TheNewsAPIProvider } from "#externalAPIs/providers/TheNewsAPIProvider.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockArticle = {
  content: "Sample content",
  description: "Sample description",
  image_url: "https://example.com/image.jpg",
  published_at: "2025-07-01T12:00:00Z",
  title: "Test News Title",
  url: "https://example.com/article",
};

describe("TheNewsAPIProvider", () => {
  let provider: TheNewsAPIProvider;

  beforeEach(() => {
    provider = new TheNewsAPIProvider();

    // mock global.fetch
    global.fetch = vi.fn() as typeof fetch;
    vi.clearAllMocks();
  });

  it("should return mapped NewsDTO[] when response is valid", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: vi.fn().mockResolvedValue({ data: [mockArticle] }),
    });

    const result = await provider.fetchNews();

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(NewsDTO);
    expect(result[0].title).toBe("Test News Title");
    expect(result[0].source).toBe("The News API");
  });

  it("should return empty array when data is not an array", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: vi.fn().mockResolvedValue({ data: null }),
    });

    const result = await provider.fetchNews();
    expect(result).toEqual([]);
  });

  it("should return empty array and log error when fetch throws", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Network error"));

    const result = await provider.fetchNews();
    expect(result).toEqual([]);
  });
});
