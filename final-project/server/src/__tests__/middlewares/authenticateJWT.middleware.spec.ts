/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from "express";

import { AuthenticatedRequest } from "#middlewares/isAdmin.middleware.js";
import { verify } from "jsonwebtoken"; // ✅ Import the mocked named export
import { beforeEach, describe, expect, it, vi } from "vitest";

import { authenticateJWT } from "../../middlewares/authenticateJWT.middleware.js";

vi.mock("jsonwebtoken", () => ({
  verify: vi.fn(), // ✅ Correctly mock named export
}));

describe("authenticateJWT middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  const json = vi.fn();
  const status = vi.fn(() => ({ json }));

  beforeEach(() => {
    req = { headers: {} };
    res = { json: json as any, status: status as any };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("should return 401 if Authorization header is missing", () => {
    authenticateJWT(req as Request, res as Response, next);
    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ error: "Missing or invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if Authorization header is malformed", () => {
    req.headers = { authorization: "BadToken" };
    authenticateJWT(req as Request, res as Response, next);
    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ error: "Missing or invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if jwt.verify throws (invalid token)", () => {
    req.headers = { authorization: "Bearer fake.token" };
    (verify as unknown as vi.Mock).mockImplementation(() => {
      throw new Error("invalid");
    });

    authenticateJWT(req as Request, res as Response, next);
    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ error: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });  
});
