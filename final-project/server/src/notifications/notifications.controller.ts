import { Request, Response } from "express";

import { NotificationService } from "./notifications.service.js";

export class NotificationController {
  constructor(private service: NotificationService) {}

  getKeywords = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const result = await this.service.getKeywords(userId);
    res.json(result);
  };

  getNotifications = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const notifs = await this.service.getNotifications(userId);
    res.json(notifs);
  };

  getPreferences = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const prefs = await this.service.getPreferences(userId);
    res.json(prefs);
  };

  setKeywords = async (req: Request, res: Response) => {
    const keywords: string[] = req.body.keywords;
    const userId:number = req.body.userId;
    await this.service.setKeywords(userId, keywords);
    res.status(200).json({ message: "Keywords saved" });
  };

  updatePreference = async (req: Request, res: Response) => {
    const categoryId:number = req.body.categoryId;
    const enabled:boolean = req.body.enabled;
    const userId:number = req.body.userId;
    await this.service.updatePreference(userId, categoryId, enabled);
    res.status(200).json({ message: "Preference updated" });
  };
}
