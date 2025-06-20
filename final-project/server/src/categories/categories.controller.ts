import { Logger } from "#utils/Logger.js";
import { Request, Response } from "express";

import { CategoriesService } from "./categories.service.js";

export class CategoriesController {
  logger: Logger = new Logger();
  constructor(private service: CategoriesService) {}

  addCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string") {
        res.status(400).json({ error: "Invalid category name" });
        return;
      }

      const category = await this.service.add(name);
      res.status(201).json(category);
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error)}`);
      res.status(500).json({ error: "Failed to add category" });
    }
  };

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.service.getAll();
      res.status(200).json(categories);
    } catch (error) {
        this.logger.error(`Error: ${JSON.stringify(error)}`);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  };
}
