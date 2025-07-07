import { RowDataPacket } from "mysql2";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ReportRepository } from "../../report/report.repository.js";
import { ReportService } from "../../report/report.service.js";
import { AppError } from "../../utils/AppError.js";

describe("ReportService", () => {
  let repo: ReportRepository;
  let service: ReportService;

  beforeEach(() => {
    repo = {
      getReportCount: vi.fn(),
      getReportedNewsNotHidden: vi.fn(),
      hasUserReported: vi.fn(),
      hideNews: vi.fn(),
      saveReport: vi.fn(),
    } as unknown as ReportRepository;

    service = new ReportService(repo);
  });

  describe("getPendingReportedNews", () => {
    it("should return unhidden reported news", async () => {
      const data = [{ id: 1, title: "News A" }];
      vi.spyOn(repo, "getReportedNewsNotHidden").mockResolvedValue(data as RowDataPacket[]);

      const result = await service.getPendingReportedNews();

      expect(result).toEqual(data);
      expect(repo.getReportedNewsNotHidden).toHaveBeenCalled();
    });
  });

  describe("hideNews", () => {
    it("should call repo.hideNews with correct id", async () => {
      await service.hideNews(123);
      expect(repo.hideNews).toHaveBeenCalledWith(123);
    });
  });

  describe("reportNews", () => {
    it("should throw if user already reported", async () => {
      vi.spyOn(repo, "hasUserReported").mockResolvedValue(true);

      await expect(service.reportNews(1, 99)).rejects.toThrow(AppError);
      expect(repo.hasUserReported).toHaveBeenCalledWith(1, 99);
    });

    it("should save report and not hide if below threshold", async () => {
      vi.spyOn(repo, "hasUserReported").mockResolvedValue(false);
      vi.spyOn(repo, "getReportCount").mockResolvedValue(1);

      await service.reportNews(2, 55);

      expect(repo.saveReport).toHaveBeenCalledWith(2, 55);
      expect(repo.getReportCount).toHaveBeenCalledWith(55);
      expect(repo.hideNews).not.toHaveBeenCalled();
    });

    it("should auto-hide news if report count >= threshold", async () => {
      vi.spyOn(repo, "hasUserReported").mockResolvedValue(false);
      vi.spyOn(repo, "getReportCount").mockResolvedValue(3);

      await service.reportNews(3, 88);

      expect(repo.saveReport).toHaveBeenCalledWith(3, 88);
      expect(repo.hideNews).toHaveBeenCalledWith(88);
    });
  });
});
