// src/features/notification/notification.router.ts
import { Router } from "express";

import { NotificationController } from "./notifications.controller.js";
import { NotificationRepository } from "./notifications.repository.js";
import { NotificationService } from "./notifications.service.js";

const router = Router();

const repo = new NotificationRepository();
const service = new NotificationService(repo);
const controller = new NotificationController(service);

router.get("/preferences/:userId", controller.getPreferences);
router.post("/preferences", controller.updatePreference);
router.get("/keywords/:userId", controller.getKeywords);
router.post("/keywords", controller.setKeywords);
router.get("/user/:userId", controller.getNotifications);

export default router;
