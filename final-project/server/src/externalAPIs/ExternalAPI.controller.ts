import { Logger } from "#utils/Logger.js";
import { Request, Response } from "express";

import { ExternalAPIService } from "./ExternalAPI.service.js";

export class ExternalAPIController {
  private logger!: Logger;
  constructor(private service: ExternalAPIService) {
    this.logger = new Logger();
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await this.service.fetchAllNews();
      res.status(200).json(news);
    } catch (error: unknown) {
      this.logger.error(`Error: ${JSON.stringify(error)}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  listAllServers = async (req: Request, res: Response): Promise<void> => {
    try {
      const servers = await this.service.listAllServers();
      res.status(200).json(servers);
    } catch (error: unknown) {
      this.logger.error(`Error: ${JSON.stringify(error)}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  refreshAndSave = async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await this.service.fetchAllNews();
      await this.service.saveNewsToDatabase(news);
      res.status(200).json(`[${new Date().toISOString()}] News successfully updated.`);
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error)}`);
      res.status(400).json({ error: "Failed to refresh and save news due to " });
    }
  };

  updateServer = async(req: Request, res: Response): Promise<void> => {
    try {
      const id:string = req.body.id;
      const key:string = req.body.key;
      const server = await this.service.updateServer(id,key);
      res.status(200).json(server);
    } catch (error: unknown) {
      this.logger.error(`Error: ${JSON.stringify(error)}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
