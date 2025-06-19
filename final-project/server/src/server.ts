import { Logger } from "#utils/Logger.js";
import dotenv from "dotenv";
import express, { Express } from "express";

import externalAPIRouter from "./externalAPIs/ExternalAPI.router.js";
import userRouter from "./user/User.router.js";

export class Server {
  private app: Express;
  private logger!: Logger;
  private port: string;

  constructor() {
    dotenv.config({ path: "./.env" });

    this.app = express();
    this.port = process.env.PORT ?? "3000";
    this.logger = new Logger();

    this.initializeMiddlewares();
    this.initializeRoutes();
  }
  public getApp(): Express {
    return this.app;
  }
  public listen(): void {
    this.app.listen(this.port, () => {
      this.logger.log(`Server is running on port ${this.port}`);
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.get("/", (req, res) => {
      res.json({ message: "Hello from Server class!" });
    });
    this.app.use("/external-news", externalAPIRouter);
    this.app.use("/users",userRouter);
  }
}
