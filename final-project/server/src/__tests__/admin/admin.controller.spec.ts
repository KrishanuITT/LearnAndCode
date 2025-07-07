/* eslint-disable @typescript-eslint/no-explicit-any */

import { AdminController } from "#admin/admin.controller.js";
import { AdminService } from "#admin/admin.service.js";
import { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
describe("AdminController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: any;
  let status: any;
  let service: AdminService;
  let controller: AdminController;

  beforeEach(() => {
    // Mock request and response
    req = { body: {} };
    json = vi.fn();
    status = vi.fn().mockImplementation(() => res as Response);

    res = {
      json,
      status,
    };

    // Mock service
    service = {
      addKeywords: vi.fn(),
      getAllKeywords: vi.fn(),
      removeKeywords: vi.fn(),
      updateQueryStatus: vi.fn(),
    } as unknown as AdminService;

    controller = new AdminController(service);
  });

  it("should return 400 if keyword is invalid", async () => {
    req.body = { keyword: "" };

    await controller.addKeyword(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: "Invalid keyword" });
  });

  describe("addKeyword", () => {
    it("should return 400 if keyword is invalid", async () => {
      req.body = { keyword: "" };

      await controller.addKeyword(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: "Invalid keyword" });
    });

    it("should call service and return 201 if keyword is valid", async () => {
      req.body = { keyword: "Technology" };

      await controller.addKeyword(req as Request, res as Response);

      expect(service.addKeywords).toHaveBeenCalledWith("technology");
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith({ message: "Keyword added successfully" });
    });
  });

  describe("deleteKeyword", () => {
    it("should return 400 if keyword is invalid", async () => {
      req.body = { keyword: "   " };

      await controller.deleteKeyword(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: "Invalid keyword" });
    });

    it("should call service and return 200 if keyword is valid", async () => {
      req.body = { keyword: "Sports" };

      await controller.deleteKeyword(req as Request, res as Response);

      expect(service.removeKeywords).toHaveBeenCalledWith("sports");
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ message: "Keyword removed successfully" });
    });
  });

  describe("getAll", () => {
    it("should return all keywords", async () => {
      const keywords = ["sports", "tech"];
      (service.getAllKeywords as any).mockResolvedValue(keywords);

      await controller.getAll(req as Request, res as Response);

      expect(service.getAllKeywords).toHaveBeenCalled();
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ keywords });
    });
  });

  describe("hideCategory", () => {
    it("should return 400 for invalid input", async () => {
      req.body = { categoryId: "not-a-number", hide: "nope" };

      await controller.hideCategory(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: "Invalid input" });
    });

    it("should call service and return 200 for valid input", async () => {
      req.body = { categoryId: 2, hide: true };

      await controller.hideCategory(req as Request, res as Response);

      expect(service.updateQueryStatus).toHaveBeenCalledWith(true, 2);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ message: "Category hidden successfully" });
    });
  });
});
