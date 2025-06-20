import { Request, Response } from "express";

import { UserService } from "./User.service.js";
import { LoginData, SignupData } from "./User.types.js";

export class UserController {
  constructor(private service: UserService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginData = req.body;
      const result = await this.service.login(loginData);
      res.status(200).json(result);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      res.status(401).json({ error: message });
    }
  };

  signup = async  (req: Request, res: Response): Promise<void> => {
    try {
      const signupData: SignupData = req.body;
      const result = await this.service.signup(signupData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error});
    }
  };
}
