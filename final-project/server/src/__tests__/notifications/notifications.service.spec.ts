/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotificationRepository } from "../../notifications/notifications.repository.js";
import { NotificationService } from "../../notifications/notifications.service.js";

describe("NotificationService", () => {
  let service: NotificationService;
  let repo: NotificationRepository;

  beforeEach(() => {
    repo = {
      deleteUserNotifications: vi.fn(),
      disableKeyword: vi.fn(),
      getKeywords: vi.fn(),
      getNotifications: vi.fn(),
      getPreferences: vi.fn(),
      saveNotification: vi.fn(),
      setKeywords: vi.fn(),
      updatePreference: vi.fn(),
    };

    service = new NotificationService(repo);
  });

  it("should clear user notifications", async () => {
    (repo.deleteUserNotifications as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);

    const result = await service.clearUserNotifications(1);

    expect(repo.deleteUserNotifications).toHaveBeenCalledWith(1);
    expect(result).toBe(true);
  });

  it("should disable keyword", async () => {
    (repo.disableKeyword as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);

    const result = await service.disableKeyword(1, "sports");

    expect(repo.disableKeyword).toHaveBeenCalledWith(1, "sports");
    expect(result).toBe(true);
  });

  it("should get user keywords", async () => {
    const mockKeywords = ["tech", "finance"];
    (repo.getKeywords as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockKeywords);

    const result = await service.getKeywords(1);

    expect(repo.getKeywords).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockKeywords);
  });

  it("should get user notifications", async () => {
    const mockNotifications = [{ articleId: 123, id: 1 }];
    (repo.getNotifications as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockNotifications);

    const result = await service.getNotifications(1);

    expect(repo.getNotifications).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockNotifications);
  });

  it("should get user preferences", async () => {
    const mockPrefs = [{ categoryId: 2, enabled: true }];
    (repo.getPreferences as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockPrefs);

    const result = await service.getPreferences(1);

    expect(repo.getPreferences).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockPrefs);
  });

  it("should save a notification", async () => {
    (repo.saveNotification as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);

    const result = await service.saveNotification(1, 99);

    expect(repo.saveNotification).toHaveBeenCalledWith(1, 99);
    expect(result).toBe(true);
  });

  it("should set keywords", async () => {
    const keywords = ["health", "science"];
    (repo.setKeywords as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);

    const result = await service.setKeywords(1, keywords);

    expect(repo.setKeywords).toHaveBeenCalledWith(1, keywords);
    expect(result).toBe(true);
  });

  it("should update preference", async () => {
    (repo.updatePreference as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);

    const result = await service.updatePreference(1, 3, false);

    expect(repo.updatePreference).toHaveBeenCalledWith(1, 3, false);
    expect(result).toBe(true);
  });
});
