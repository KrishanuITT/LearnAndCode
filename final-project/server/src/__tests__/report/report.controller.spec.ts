/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RowDataPacket } from "mysql2";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ReportService } from "../..//report/report.service.js";
import { ReportController } from "../../report/report.controller.js";
import { AppError } from "../../utils/AppError.js";

describe("ReportController", () => {
  let controller: ReportController;
  let service: ReportService;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    service = {
      getPendingReportedNews: vi.fn(),
      hideNews: vi.fn(),
      reportNews: vi.fn()
    } as unknown as ReportService;

    controller = new ReportController(service);

    mockReq = {};
    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    };
  });

  describe("getReportedNews", () => {
    it("should return reported news with 200", async () => {
      const dummyData = [{ id: 1, title: "Reported News" }];
      vi.spyOn(service, "getPendingReportedNews").mockResolvedValue(dummyData as RowDataPacket[]);

      await controller.getReportedNews(mockReq, mockRes);

      expect(service.getPendingReportedNews).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(dummyData);
    });

    it("should handle error", async () => {
      const err = new Error("DB error");
      vi.spyOn(service, "getPendingReportedNews").mockRejectedValue(err);
      const spy = vi.spyOn(AppError, "handleUnknownError");

      await controller.getReportedNews(mockReq, mockRes);

      expect(spy).toHaveBeenCalledWith(err, mockRes);
    });
  });

  describe("hideReportedNews", () => {
    it("should hide article and return 200", async () => {
      mockReq.params = { newsId: "42" };

      await controller.hideReportedNews(mockReq, mockRes);

      expect(service.hideNews).toHaveBeenCalledWith(42);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "News article hidden successfully" });
    });

    it("should return 400 for invalid newsId", async () => {
      mockReq.params = { newsId: "abc" };

      await controller.hideReportedNews(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid news ID" });
    });

    it("should handle error from hideNews", async () => {
      const err = new Error("Something failed");
      vi.spyOn(service, "hideNews").mockRejectedValue(err);
      mockReq.params = { newsId: "99" };
      const spy = vi.spyOn(AppError, "handleUnknownError");

      await controller.hideReportedNews(mockReq, mockRes);

      expect(spy).toHaveBeenCalledWith(err, mockRes);
    });
  });

  describe("reportNews", () => {
    it("should submit report and return 201", async () => {
      mockReq.body = { newsId: 7 };
      mockReq.user = { id: 3 };

      await controller.reportNews(mockReq, mockRes);

      expect(service.reportNews).toHaveBeenCalledWith(3, 7);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Report submitted successfully" });
    });

    it("should return 400 for invalid newsId", async () => {
      mockReq.body = { newsId: "invalid" };
      mockReq.user = { id: 1 };

      await controller.reportNews(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid news ID" });
    });

    it("should handle AppError specifically", async () => {
      const appErr = new AppError("Custom error", 409);
      vi.spyOn(service, "reportNews").mockRejectedValue(appErr);
      const handleSpy = vi.spyOn(appErr, "handle");
      mockReq.body = { newsId: 1 };
      mockReq.user = { id: 4 };

      await controller.reportNews(mockReq, mockRes);

      expect(handleSpy).toHaveBeenCalledWith(mockRes);
    });

    it("should handle unknown error", async () => {
      const err = new Error("Something bad");
      vi.spyOn(service, "reportNews").mockRejectedValue(err);
      const spy = vi.spyOn(AppError, "handleUnknownError");
      mockReq.body = { newsId: 8 };
      mockReq.user = { id: 2 };

      await controller.reportNews(mockReq, mockRes);

      expect(spy).toHaveBeenCalledWith(err, mockRes);
    });
  });
});
