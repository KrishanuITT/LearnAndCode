import { Express } from "express";


export class UserRoutes {
    public routes(app: Express): void {
        app.get("/", (req, res) => {
            res.send("Hello from Server class!");
        });
    }
}