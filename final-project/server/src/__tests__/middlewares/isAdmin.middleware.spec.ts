/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { isAdmin } from "../../middlewares/isAdmin.middleware.js";
import type { AuthenticatedRequest } from "../../middlewares/isAdmin.middleware.js";
import type { Response, NextFunction } from "express";

// Mock db module
vi.mock("../../db.js", () => ({
  db: {
    query: vi.fn(),
  },
}));

import { db } from "../../db.js";

describe("isAdmin middleware", () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  const next = vi.fn();

  const json = vi.fn();
  const status = vi.fn(() => ({ json }));

  beforeEach(() => {
    req = {
      user: {
        id: 1,
        email: "admin@example.com",
        role: "admin",
      },
    };

    res = {
      status: status as any,
      json: json as any,
    };

    vi.clearAllMocks();
  });

  it("should return 401 if user.id is missing", async () => {
    req.user = { email: "x@example.com", id: 0 }; // id = 0 is falsy

    await isAdmin(req as AuthenticatedRequest, res as Response, next as NextFunction);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ error: "Unauthorized: User not found" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not an admin", async () => {
    (db.query as any).mockResolvedValueOnce([
      [{ role: "user" }], // not admin
    ]);

    await isAdmin(req as AuthenticatedRequest, res as Response, next as NextFunction);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({ error: "Forbidden: Admins only" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() if user is an admin", async () => {
    (db.query as any).mockResolvedValueOnce([[{ role: "admin" }]]);

    await isAdmin(req as AuthenticatedRequest, res as Response, next as NextFunction);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
    expect(next).toHaveBeenCalled();
    expect(status).not.toHaveBeenCalled();
  });

  it("should return 500 on database error", async () => {
    (db.query as any).mockRejectedValueOnce(new Error("DB Error"));

    await isAdmin(req as AuthenticatedRequest, res as Response, next as NextFunction);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: "Internal server error" });
    expect(next).not.toHaveBeenCalled();
  });
});
