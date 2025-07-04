import { AppError } from "#utils/AppError.js";

import { ReportRepository } from "./report.repository.js";

const AUTO_HIDE_THRESHOLD = 2;

export class ReportService {
  constructor(private repo: ReportRepository) {}

  async getPendingReportedNews() {
    return await this.repo.getReportedNewsNotHidden();
  }

  async hideNews(newsId: number) {
    await this.repo.hideNews(newsId);
  }

  async reportNews(userId: number, newsId: number): Promise<void> {
    const alreadyReported = await this.repo.hasUserReported(userId, newsId);
    if (alreadyReported) {
      throw new AppError("You have already reported this article", 409);
    }

    await this.repo.saveReport(userId, newsId);

    const count = await this.repo.getReportCount(newsId);
    if (count >= AUTO_HIDE_THRESHOLD) {
      await this.repo.hideNews(newsId);
    }
  }
}
