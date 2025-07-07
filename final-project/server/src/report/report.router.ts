import { authenticateJWT } from "#middlewares/authenticateJWT.middleware.js";
import { isAdmin } from "#middlewares/isAdmin.middleware.js";
import { Router } from "express";

import { ReportController } from "./report.controller.js";
import { ReportRepository } from "./report.repository.js";
import { ReportService } from "./report.service.js";

const repo = new ReportRepository();
const service = new ReportService(repo);
const controller = new ReportController(service);

const router = Router();

router.post("/", authenticateJWT, controller.reportNews);
router.get("/pending", authenticateJWT, isAdmin, controller.getReportedNews);
router.patch("/hide/:newsId", authenticateJWT, isAdmin, controller.hideReportedNews);

export default router;
