import type { Request, Response } from "express";

import supertest from "supertest";
import { describe, expect, it, vi } from "vitest";

import { Server } from "../server.js";

describe("Server class", () => {
  const server = new Server();
  const app = server.getApp();

  it("should respond with greeting on GET /", async () => {
    const agent = supertest(app);
    const response = await agent.get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello from Server class!");
  });

  it("should parse JSON bodies", async () => {
    app.post("/test-json", (req: Request, res: Response): void => {
      res.status(200).json({ received: req.body });
    });

    const payload = { name: "Krishanu" };

    const agent = supertest(app);
    const response = await agent
      .post("/test-json")
      .send(payload)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ received: payload });
  });

  it("should call app.listen with correct port", () => {
    const listenSpy = vi.spyOn(app, "listen").mockImplementation((_port, callback) => {
      callback?.();
      return {} as unknown as ReturnType<typeof app.listen>;
    });

    server.listen();

    expect(listenSpy).toHaveBeenCalledTimes(1);
    expect(listenSpy).toHaveBeenCalledWith("5000", expect.any(Function));
    
    listenSpy.mockRestore();
  });
});
