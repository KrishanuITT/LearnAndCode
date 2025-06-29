import { AppError } from "#utils/AppError.js";
import { Request, Response } from "express";

import { AdminService } from "./admin.service.js";

export class AdminController {
  constructor(private service: AdminService) {}

  addKeyword = async (req: Request, res: Response): Promise<void> => {
    const { keyword } = req.body;
    if (typeof keyword !== "string" || !keyword.trim()) {
      res.status(400).json({ error: "Invalid keyword" });
      return;
    }

    try {
      await this.service.addKeywords(keyword.trim().toLowerCase());
      res.status(201).json({ message: "Keyword added successfully" });
    } catch (error) {
      AppError.handleUnknownError(error, res);
    }
  };

  deleteKeyword = async (req: Request, res: Response): Promise<void> => {
    const { keyword } = req.body;
    if (typeof keyword !== "string" || !keyword.trim()) {
      res.status(400).json({ error: "Invalid keyword" });
      return;
    }

    try {
      await this.service.removeKeywords(keyword.trim().toLowerCase());
      res.status(200).json({ message: "Keyword removed successfully" });
    } catch (error) {
      AppError.handleUnknownError(error, res);
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const keywords = await this.service.getAllKeywords();
      res.status(200).json({ keywords });
    } catch (error) {
      AppError.handleUnknownError(error, res);
    }
  };

  hideCategory = async (req: Request, res: Response) => {
    const categoryId: number = req.body.categoryId;
    const hide: boolean = req.body.hide;

    if (typeof categoryId !== "number" || typeof hide !== "boolean") {
      res.status(400).json({ error: "Invalid input" });
    }

    try {
      await this.service.updateQueryStatus(hide, categoryId);
      res.status(200).json({ message: `Category ${hide ? "hidden" : "unhidden"} successfully` });
    } catch (err) {
      console.error("Failed to update category:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
