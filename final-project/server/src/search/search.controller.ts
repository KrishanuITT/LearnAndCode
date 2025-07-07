import { Logger } from "#utils/Logger.js";
import { Request, Response } from "express";

import { SearchService } from "./search.service.js";

export class SearchController {
  private logger: Logger;

  constructor(private service: SearchService) {
    this.logger = new Logger();
  }

  searchArticles = async (req: Request, res: Response) => {
    const endDate: string = req.body.endDate;
    const query: string = req.body.query;
    const sortBy: "dislikes" | "likes" = req.body.sortBy;
    const startDate: string = req.body.startDate;

    if (!query) {
      res.status(400).json({ error: "Search query is required" });
    }

    try {
      const results = await this.service.search(query, startDate, endDate, sortBy);
      res.json(results);
    } catch (err) {
      this.logger.error(`Search error: ${JSON.stringify(err)}`);
      res.status(500).json({ error: "Failed to perform search" });
    }
  };
}
