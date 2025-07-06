 
/* eslint-disable @typescript-eslint/no-explicit-any */

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { NewsDTO } from "../../externalAPIs/DTOs/NewsAPIDTO.js";
import type { UserDTO } from "../../user/User.dto.js";

import { NewsIngestionService } from "../../notifications/mail.service.js";
import { NotificationRepository } from "../../notifications/notifications.repository.js";
import { UserRepository } from "../../user/User.repository.js";
import { sendNotificationEmail } from "../../utils/mailer.js";

// 🔧 Mock external mailer
vi.mock("../../utils/mailer.js", () => ({
  sendNotificationEmail: vi.fn()
}));

describe("NewsIngestionService", () => {
  let notifRepo: NotificationRepository;
  let userRepo: UserRepository;
  let service: NewsIngestionService;

  beforeEach(() => {
    notifRepo = {
      getKeywords: vi.fn(),
      getPreferences: vi.fn(),
      saveNotification: vi.fn()
    } as unknown as NotificationRepository;

    userRepo = {
      getAllUsersWithEmail: vi.fn()
    } as unknown as UserRepository;

    service = new NewsIngestionService(notifRepo, userRepo);
    vi.clearAllMocks();
  });

  it("should notify users based on matching category and keywords", async () => {
    const articles: NewsDTO[] = [
      {
          category: "Technology", content: "", description: "",
          id: 1,
          imageUrl: "",
          keywords: [],
          publishedAt: new Date(),
          source: "",
          title: "Tech breakthrough",
          url: ""
      },
      {
          category: "Business", content: "", description: "",
          id: 2,
          imageUrl: "",
          keywords: [],
          publishedAt: new Date(),
          source: "",
          title: "Stock market falls",
          url: ""
      }
    ];

    const users: UserDTO[] = [
      {
          email: "a@example.com", id: 10,
          name: "",
          role: ""
      },
      {
          email: "b@example.com", id: 20,
          name: "",
          role: ""
      }
    ];

    (userRepo.getAllUsersWithEmail as any).mockResolvedValue(users);

    (notifRepo.getPreferences as any).mockImplementation((userId: number) => {
      return userId === 10
        ? [{ category: "Technology", enabled: true }]
        : [{ category: "Business", enabled: false }];
    });

    (notifRepo.getKeywords as any).mockImplementation((userId: number) => {
      return userId === 10
        ? [{ enabled: false, keyword: "stock" }]
        : [{ enabled: true, keyword: "stock" }];
    });

    await service.checkAndNotifyUsers(articles);

    // For user 10: match by category
    expect(notifRepo.saveNotification).toHaveBeenCalledWith(10, 1, "Tech breakthrough");
    // For user 20: match by keyword
    expect(notifRepo.saveNotification).toHaveBeenCalledWith(20, 2, "Stock market falls");

    expect(sendNotificationEmail).toHaveBeenCalledWith("a@example.com", [
        expect.objectContaining({
          category: "Technology",
          id: 1,
          title: "Tech breakthrough"
        })
      ]);
      
      expect(sendNotificationEmail).toHaveBeenCalledWith("b@example.com", [
        expect.objectContaining({
          category: "Business",
          id: 2,
          title: "Stock market falls"
        })
      ]);
      
  });

  it("should not notify users if no articles match", async () => {
    const users: UserDTO[] = [{
        email: "x@example.com", id: 1,
        name: "",
        role: ""
    }];
    const articles: NewsDTO[] = [
      {
          category: "Finance", content: "", description: "",
          id: 1,
          imageUrl: "",
          keywords: [],
          publishedAt: new Date(),
          source: "",
          title: "Economy update",
          url: ""
      }
    ];

    (userRepo.getAllUsersWithEmail as any).mockResolvedValue(users);
    (notifRepo.getPreferences as any).mockResolvedValue([{ category: "Sports", enabled: true }]);
    (notifRepo.getKeywords as any).mockResolvedValue([{ enabled: true, keyword: "cricket" }]);

    await service.checkAndNotifyUsers(articles);

    expect(notifRepo.saveNotification).not.toHaveBeenCalled();
    expect(sendNotificationEmail).not.toHaveBeenCalled();
  });

  it("should skip users if preferences and keywords are empty", async () => {
    const users: UserDTO[] = [{
        email: "no-match@example.com", id: 99,
        name: "",
        role: ""
    }];
    const articles: NewsDTO[] = [
      {
          category: "Technology", content: "", description: "",
          id: 3,
          imageUrl: "",
          keywords: [],
          publishedAt: new Date(),
          source: "",
          title: "New tech device",
          url: ""
      }
    ];

    (userRepo.getAllUsersWithEmail as any).mockResolvedValue(users);
    (notifRepo.getPreferences as any).mockResolvedValue([]);
    (notifRepo.getKeywords as any).mockResolvedValue([]);

    await service.checkAndNotifyUsers(articles);

    expect(notifRepo.saveNotification).not.toHaveBeenCalled();
    expect(sendNotificationEmail).not.toHaveBeenCalled();
  });
});
