import { Router } from "express";

import { UserController } from "./User.controller.js";
import { UserRepository } from "./User.repository.js";
import { UserService } from "./User.service.js";

const repo = new UserRepository();
const service = new UserService(repo);
const controller = new UserController(service);

const router = Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);

export default router;
