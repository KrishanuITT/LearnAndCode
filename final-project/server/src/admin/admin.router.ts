import { authenticateJWT } from "#middlewares/authenticateJWT.middleware.js";
import { isAdmin } from "#middlewares/isAdmin.middleware.js";
import { Router } from "express";

import { AdminController } from "./admin.controller.js";
import { AdminRepository } from "./admin.repository.js";
import { AdminService } from "./admin.service.js";

const repo = new AdminRepository();
const service = new AdminService(repo);
const controller = new AdminController(service);

const router = Router();

router.post("/hideCategory", authenticateJWT, isAdmin, controller.hideCategory);
router
  .route("/filterKeywords")
  .get(authenticateJWT, isAdmin, controller.getAll)
  .post(authenticateJWT, isAdmin, controller.addKeyword)
  .delete(authenticateJWT, isAdmin, controller.deleteKeyword);

export default router;
