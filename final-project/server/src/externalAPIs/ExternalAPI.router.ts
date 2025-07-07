import express from "express";

import { ExternalAPIController } from "./ExternalAPI.controller.js";
import { ExternalAPIRepository } from "./ExternalAPI.repository.js";
import { ExternalAPIService } from "./ExternalAPI.service.js";
import { ExternalAPIManager } from "./ExternalAPIManager.js";

const router = express.Router();
const service = new ExternalAPIService(new ExternalAPIManager(), new ExternalAPIRepository());
const controller = new ExternalAPIController(service);

router.get("/all", controller.getAll);
router.get("/refresh", controller.refreshAndSave);
router.get("/list", controller.listAllServers);
router.post("/update", controller.updateServer);

export default router;
