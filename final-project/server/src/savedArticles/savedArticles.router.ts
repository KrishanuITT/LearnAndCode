import { authenticateJWT } from "#middlewares/authenticateJWT.middleware.js";
import { Router } from "express";

import { SavedArticlesController } from "./savedArticles.controller.js";
import { SavedArticlesRepository } from "./savedArticles.repository.js";
import { SavedArticlesService } from "./savedArticles.service.js";

const router = Router();
const repo = new SavedArticlesRepository();
const service = new SavedArticlesService(repo);
const controller = new SavedArticlesController(service);

router.get("/:userId", controller.getSavedArticles);
router.post("/", controller.saveArticle);
router.delete("/", controller.deleteArticle);
router.post("/like", authenticateJWT, controller.likeOrDislikeArticle);

export default router;
