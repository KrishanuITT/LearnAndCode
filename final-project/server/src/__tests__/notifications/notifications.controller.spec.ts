 
 

import type { Request, Response } from "express";

import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { NotificationController } from "../../notifications/notifications.controller.js";
import { NotificationService } from "../../notifications/notifications.service.js";

describe("NotificationController", () => {
  let service: NotificationService;
  let controller: NotificationController;
  let mockRes: Response;

  const mockJson = vi.fn();
  const mockStatus = vi.fn().mockReturnValue({
    json: mockJson
  });

  beforeEach(() => {
    service = {
      clearUserNotifications: vi.fn(),
      getKeywords: vi.fn(),
      getNotifications: vi.fn(),
      getPreferences: vi.fn(),
      setKeywords: vi.fn(),
      updatePreference: vi.fn()
    } as unknown as NotificationService;

    controller = new NotificationController(service);

    mockJson.mockClear();
    mockStatus.mockClear();

    // Full mock of Express Response type using type assertion
    mockRes = {
      json: mockJson,
      status: mockStatus
    } as unknown as Response;
  });

  it("should delete user notifications", async () => {
    const req = { params: { userId: "5" } } as unknown as Request;

    await controller.deleteUserNotifications(req, mockRes);

    expect(service.clearUserNotifications).toHaveBeenCalledWith(5);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({ message: "User notifications cleared." });
  });

  it("should handle error in deleteUserNotifications", async () => {
    const req = { params: { userId: "5" } } as unknown as Request;
    (service.clearUserNotifications as Mock).mockRejectedValueOnce(new Error("DB error"));

    await controller.deleteUserNotifications(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      error: expect.stringContaining("Failed to clear notifications.")
    });
  });

  it("should get user keywords", async () => {
    const req = { params: { userId: "2" } } as unknown as Request;
    const mockKeywords = ["tech", "finance"];
    (service.getKeywords as Mock).mockResolvedValueOnce(mockKeywords);

    await controller.getKeywords(req, mockRes);

    expect(service.getKeywords).toHaveBeenCalledWith(2);
    expect(mockJson).toHaveBeenCalledWith(mockKeywords);
  });

  it("should get user notifications", async () => {
    const req = { params: { userId: "1" } } as unknown as Request;
    const mockNotifications = [{ id: 1 }];
    (service.getNotifications as Mock).mockResolvedValueOnce(mockNotifications);

    await controller.getNotifications(req, mockRes);

    expect(service.getNotifications).toHaveBeenCalledWith(1);
    expect(mockJson).toHaveBeenCalledWith(mockNotifications);
  });

  it("should get user preferences", async () => {
    const req = { params: { userId: "3" } } as unknown as Request;
    const mockPrefs = [{ categoryId: 2, enabled: true }];
    (service.getPreferences as Mock).mockResolvedValueOnce(mockPrefs);

    await controller.getPreferences(req, mockRes);

    expect(service.getPreferences).toHaveBeenCalledWith(3);
    expect(mockJson).toHaveBeenCalledWith(mockPrefs);
  });

  it("should set user keywords", async () => {
    const req = {
      body: {
        keywords: ["sports", "tech"],
        userId: 1
      }
    } as Request;

    await controller.setKeywords(req, mockRes);

    expect(service.setKeywords).toHaveBeenCalledWith(1, ["sports", "tech"]);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({ message: "Keywords saved" });
  });

  it("should update user preference", async () => {
    const req = {
      body: {
        categoryId: 4,
        enabled: false,
        userId: 1
      }
    } as Request;

    await controller.updatePreference(req, mockRes);

    expect(service.updatePreference).toHaveBeenCalledWith(1, 4, false);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({ message: "Preference updated" });
  });
});
