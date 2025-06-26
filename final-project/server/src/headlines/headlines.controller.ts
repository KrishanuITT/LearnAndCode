/* eslint-disable @typescript-eslint/no-base-to-string */
import { Logger } from "#utils/Logger.js";
import { Request, Response } from "express";

import { HeadlinesService } from "./headlines.service.js";

export class HeadlinesController {
  private logger = new Logger();
  constructor(private service: HeadlinesService) {}

  getHeadlinesByDateRanges = async (req: Request, res: Response) => {
    const { category, endDate, startDate } = req.body;

    if (!startDate || !endDate) {
      res.status(400).json({ error: "Start and end dates are required" });
    }

    try {
      const headlines = await this.service.getHeadlinesByDateRange(startDate as string, endDate as string, category as string);
      res.json(headlines);
    } catch (err) {
      this.logger.error(`Error: ${JSON.stringify(err)}`);
      res.status(500).json({ error: "Failed to fetch headlines for date range" });
    }
  };

  getTodayHeadlines = async (_req: Request, res: Response) => {
    try {
      const headlines = await this.service.getTodayHeadlines();
      res.json(headlines);
    } catch (err) {
      this.logger.error(`Error: ${JSON.stringify(err)}`);
      res.status(500).json({ error: "Failed to fetch today's headlines" });
    }
  };
}
