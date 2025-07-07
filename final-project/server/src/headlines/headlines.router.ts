import { authenticateJWT } from "#middlewares/authenticateJWT.middleware.js";
import { Router } from "express";

import { HeadlinesController } from "./headlines.controller.js";
import { HeadlinesRepository } from "./headlines.repository.js";
import { HeadlinesService } from "./headlines.service.js";

const router = Router();
const repository = new HeadlinesRepository();
const service = new HeadlinesService(repository);
const controller = new HeadlinesController(service);

router.post("/range", authenticateJWT, controller.getHeadlinesByDateRanges);
router.get("/today", authenticateJWT, controller.getTodayHeadlines);

export default router;
