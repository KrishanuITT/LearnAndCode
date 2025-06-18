import dotenv from "dotenv";
import express, { Express } from "express";

import {Database} from "./db.js";

export class Server {
    private app: Express;
    private db: Database;
    private port: string;

    constructor() {
        dotenv.config({ path: "./.env" });

        this.app = express();
        this.port = process.env.PORT ?? "3000";
        this.db = new Database();

        this.initializeMiddlewares();
        this.initializeRoutes();
    }
    public getApp(): Express {
        return this.app;
    }
    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
    }

    private initializeRoutes(): void {
        this.app.get("/", (req, res) => {
            res.send("Hello from Server class!");
        });
        this.app.get("/users", async (req, res) => {
            try {
              const [rows] = await this.db.query("SELECT * FROM users");
              res.status(200).json(rows);
            } catch (error: unknown) {
              res.status(500).json({ error: error });
            }
          });
    }

}
