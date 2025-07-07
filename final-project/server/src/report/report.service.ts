import { AppError } from "#utils/AppError.js";

import { ReportRepository } from "./report.repository.js";

const AUTO_HIDE_THRESHOLD = 2;

export class ReportService {
  constructor(private repository: ReportRepository) {}

  async getPendingReportedNews() {
    return await this.repository.getReportedNewsNotHidden();
  }

  async hideNews(newsId: number) {
    await this.repository.hideNews(newsId);
  }

  async reportNews(userId: number, newsId: number): Promise<void> {
    const alreadyReported = await this.repository.hasUserReported(userId, newsId);
    if (alreadyReported) {
      throw new AppError("You have already reported this article", 409);
    }

    await this.repository.saveReport(userId, newsId);

    const count = await this.repository.getReportCount(newsId);
    if (count >= AUTO_HIDE_THRESHOLD) {
      await this.repository.hideNews(newsId);
    }
  }
}
