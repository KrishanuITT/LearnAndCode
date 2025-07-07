/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppError } from "#utils/AppError.js";
import { Request, Response } from "express";

import { ReportService } from "./report.service.js";

export class ReportController {
  constructor(private service: ReportService) {}

  getReportedNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const reported = await this.service.getPendingReportedNews();
      res.status(200).json(reported);
    } catch (error) {
      AppError.handleUnknownError(error, res);
    }
  };

  hideReportedNews = async (req: Request, res: Response): Promise<void> => {
    const newsId = Number(req.params.newsId);

    if (!newsId || isNaN(newsId)) {
      res.status(400).json({ error: "Invalid news ID" });
      return;
    }

    try {
      await this.service.hideNews(newsId);
      res.status(200).json({ message: "News article hidden successfully" });
    } catch (error) {
      AppError.handleUnknownError(error, res);
    }
  };

  reportNews = async (req: Request, res: Response): Promise<void> => {
    const newsId = Number(req.body.newsId);
    const user = (req as any).user;
    if (!newsId || typeof newsId !== "number") {
      res.status(400).json({ error: "Invalid news ID" });
      return;
    }

    try {
      await this.service.reportNews(user.id, newsId);
      res.status(201).json({ message: "Report submitted successfully" });
    } catch (error) {
      if (error instanceof AppError) {
        error.handle(res);
      } else {
        AppError.handleUnknownError(error, res);
      }
    }
  };
}
