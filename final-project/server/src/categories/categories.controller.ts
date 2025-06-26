import { AppError } from "#utils/AppError.js";
import { Request, Response } from "express";

import { CategoriesService } from "./categories.service.js";

export class CategoriesController {
  constructor(private service: CategoriesService) {}

  addCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string") {
        throw new AppError("Invalid category name", 400);
      }

      const category = await this.service.add(name);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof AppError) {
        error.handle(res);
      } else {
        AppError.handleUnknownError(error, res);
      }
    }
  };

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.service.getAll();
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof AppError) {
        error.handle(res);
      } else {
        AppError.handleUnknownError(error, res);
      }
    }
  };
}
