/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Response } from "express";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { HeadlinesController } from "../../headlines/headlines.controller.js";
import { HeadlinesService } from "../../headlines/headlines.service.js";

describe("HeadlinesController", () => {
  let controller: HeadlinesController;
  let service: HeadlinesService;

  const json = vi.fn();
  const status = vi.fn(() => ({ json }));

  const mockRes = {
    json,
    status,
  } as unknown as Response;


  beforeEach(() => {
    service = {
      getHeadlinesByDateRange: vi.fn(),
      getTodayHeadlines: vi.fn(),
    } as unknown as HeadlinesService;

    controller = new HeadlinesController(service);

    vi.clearAllMocks();
  });

  describe("getHeadlinesByDateRanges", () => {
    it("should return 400 if startDate or endDate is missing", async () => {
      const req = {
        body: { category: "sports", endDate: "", startDate: "" },
        user: { id: 1 },
      } as any;

      await controller.getHeadlinesByDateRanges(req, mockRes);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        error: "Start and end dates are required",
      });
    });

    it("should return headlines if valid input is provided", async () => {
      const headlines = [{ id: 1, title: "Test headline" }];
      (service.getHeadlinesByDateRange as any).mockResolvedValue(headlines);

      const req = {
        body: {
          category: "technology",
          endDate: "2025-07-06",
          startDate: "2025-07-01",
        },
        user: { id: 42 },
      } as any;

      await controller.getHeadlinesByDateRanges(req, mockRes);

      expect(service.getHeadlinesByDateRange).toHaveBeenCalledWith(
        "2025-07-01",
        "2025-07-06",
        "technology",
        42
      );
      expect(json).toHaveBeenCalledWith(headlines);
    });

    it("should return 500 on service error", async () => {
      (service.getHeadlinesByDateRange as any).mockRejectedValue(
        new Error("Service failure")
      );

      const req = {
        body: {
          category: "business",
          endDate: "2025-07-06",
          startDate: "2025-07-01",
        },
        user: { id: 7 },
      } as any;

      await controller.getHeadlinesByDateRanges(req, mockRes);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        error: "Failed to fetch headlines for date range",
      });
    });
  });

  describe("getTodayHeadlines", () => {
    it("should return headlines for today", async () => {
      const headlines = [{ id: 5, title: "Today’s headline" }];
      (service.getTodayHeadlines as any).mockResolvedValue(headlines);

      const req = { user: { id: 101 } } as any;

      await controller.getTodayHeadlines(req, mockRes);

      expect(service.getTodayHeadlines).toHaveBeenCalledWith(101);
      expect(json).toHaveBeenCalledWith(headlines);
    });

    it("should return 500 on error", async () => {
      (service.getTodayHeadlines as any).mockRejectedValue(
        new Error("DB down")
      );

      const req = { user: { id: 99 } } as any;

      await controller.getTodayHeadlines(req, mockRes);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        error: "Failed to fetch today's headlines",
      });
    });
  });
});
