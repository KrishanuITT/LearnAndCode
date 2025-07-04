import { Router } from "express";

import { CategoriesController } from "./categories.controller.js";
import { CategoriesRepository } from "./categories.repository.js";
import { CategoriesService } from "./categories.service.js";

const repo = new CategoriesRepository();
const service = new CategoriesService(repo);
const controller = new CategoriesController(service);

const router = Router();

router.get("/", controller.getAllCategories);
router.post("/", controller.addCategory);
router.get("/name/:name", controller.getCategoryByName);

export default router;
