import { Router } from "express";

import { SearchController } from "./search.controller.js";
import { SearchRepository } from "./search.repository.js";
import { SearchService } from "./search.service.js";

const router = Router();
const repo = new SearchRepository();
const service = new SearchService(repo);
const controller = new SearchController(service);

router.post("/", controller.searchArticles);

export default router;
