/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, expect, it, vi } from "vitest";

import { AppError } from "../../utils/AppError.js";

describe("AppError", () => {
  it("should create an AppError instance with defaults", () => {
    const error = new AppError("Something went wrong");

    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(Error);
  });

  it("should create an AppError instance with custom status and operational flag", () => {
    const error = new AppError("Not Found", 404, false);

    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(false);
  });

  it("should handle AppError and call res.status().json()", () => {
    const mockStatus = vi.fn().mockReturnThis();
    const mockJson = vi.fn();
    const res = { json: mockJson, status: mockStatus } as any;

    const error = new AppError("Bad Request", 400);
    error.handle(res);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ error: "Bad Request" });
  });

  it("should handle unknown error and return 500", () => {
    const mockStatus = vi.fn().mockReturnThis();
    const mockJson = vi.fn();
    const res = { json: mockJson, status: mockStatus } as any;

    AppError.handleUnknownError(new Error("Unexpected"), res);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should handle unknown error even if not an instance of Error", () => {
    const mockStatus = vi.fn().mockReturnThis();
    const mockJson = vi.fn();
    const res = { json: mockJson, status: mockStatus } as any;

    AppError.handleUnknownError("some string error", res);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});
