import { Logger } from "#utils/Logger.js";
import dotenv from "dotenv";
import express, { Express } from "express";
import morgan from "morgan";

import "./utils/newsSyncJob.js";
import categoriesRouter from "./categories/categories.router.js";
import externalAPIRouter from "./externalAPIs/ExternalAPI.router.js";
import headlinesRouter from "./headlines/headlines.router.js";
import notificationsRouter from "./notifications/notifications.router.js";
import savedArticlesRouter from "./savedArticles/savedArticles.router.js";
import searchRouter from "./search/search.router.js";
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
    this.app.use(morgan("dev"));
  }

  private initializeRoutes(): void {
    this.app.get("/", (req, res) => {
      res.json({ message: "Hello from Server class!" });
    });
    this.app.use("/external-api", externalAPIRouter);
    this.app.use("/users", userRouter);
    this.app.use("/categories", categoriesRouter);
    this.app.use("/headlines", headlinesRouter);
    this.app.use("/saved-articles", savedArticlesRouter);
    this.app.use("/search", searchRouter);
    this.app.use("/notifications", notificationsRouter);
  }
}
