import { AppError } from "#utils/AppError.js";
import { Request, Response } from "express";

import { ExternalAPIService } from "./ExternalAPI.service.js";

export class ExternalAPIController {
  constructor(private service: ExternalAPIService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await this.service.fetchAllNews();
      res.status(200).json(news);
    } catch (error) {
      if (error instanceof AppError) {
        error.handle(res);
      } else {
        AppError.handleUnknownError(error, res);
      }
    }
  };

  listAllServers = async (req: Request, res: Response): Promise<void> => {
    try {
      const servers = await this.service.listAllServers();
      res.status(200).json(servers);
    } catch (error) {
      if (error instanceof AppError) {
        error.handle(res);
      } else {
        AppError.handleUnknownError(error, res);
      }
    }
  };

  refreshAndSave = async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await this.service.fetchAllNews();
      await this.service.saveNewsToDatabase(news);
      res.status(200).json(`[${new Date().toISOString()}] News successfully updated.`);
    } catch (error) {
      if (error instanceof AppError) {
        error.handle(res);
      } else {
        AppError.handleUnknownError(error, res);
      }
    }
  };

  updateServer = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.body.id;
      const key: string = req.body.key;
      const server = await this.service.updateServer(id, key);
      res.status(200).json(server);
    } catch (error) {
      if (error instanceof AppError) {
        error.handle(res);
      } else {
        AppError.handleUnknownError(error, res);
      }
    }
  };
}
