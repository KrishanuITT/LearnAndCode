/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppError } from "#utils/AppError.js";
import { Logger } from "#utils/Logger.js";
import { Request, Response } from "express";

import { SavedArticlesService } from "./savedArticles.service.js";

export class SavedArticlesController {
  private logger = new Logger();

  constructor(private service: SavedArticlesService) {}

  deleteArticle = async (req: Request, res: Response) => {
    const newsId:number = req.body.newsId;
    const userId:number = req.body.userId;
  
    try {
      await this.service.delete(userId, newsId);
      res.status(200).json({ message: "Article deleted." });
    } catch (err) {
      this.logger.error(`Error deleting article: ${JSON.stringify(err)}`);
      res.status(500).json({ error: "Failed to delete article." });
    }
  };
  

  getSavedArticles = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    try {
      const articles = await this.service.getAll(userId);
      res.json(articles);
    } catch (err) {
      this.logger.error(`Error fetching saved articles: ${JSON.stringify(err)}`);
      res.status(500).json({ error: "Failed to fetch saved articles." });
    }
  };

  likeOrDislikeArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      const { isLike, newsId } = req.body;

      if (!newsId || typeof isLike !== "boolean") {
        res.status(400).json({ error: "Invalid request data" });
        return;
      }

      await this.service.likeOrDislike(user.id, newsId, isLike);
      res.status(200).json({ message: isLike ? "Article liked" : "Article disliked" });
    } catch (err) {
      AppError.handleUnknownError(err, res);
    }
  };

  saveArticle = async (req: Request, res: Response) => {
    const newsId: number = req.body.newsId;
    const userId: number = req.body.userId;
    console.log("Server: save article");
    try {
      await this.service.save(userId, newsId);
      res.status(201).json({ message: "Article saved." });
    } catch (err) {
      this.logger.error(`Error saving article: ${JSON.stringify(err)}`);
      res.status(500).json({ error: "Failed to save article." });
    }
  };
}
