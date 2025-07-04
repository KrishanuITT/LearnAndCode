import { NotificationRepository } from "./notifications.repository.js";

export class NotificationService {
  constructor(private repo: NotificationRepository) {}

  clearUserNotifications(userId: number) {
    return this.repo.deleteUserNotifications(userId);
  }  

  disableKeyword(userId: number, keyword: string) {
    return this.repo.disableKeyword(userId, keyword);
  }

  getKeywords(userId: number) {
    return this.repo.getKeywords(userId);
  }

  getNotifications(userId: number) {
    return this.repo.getNotifications(userId);
  }

  getPreferences(userId: number) {
    return this.repo.getPreferences(userId);
  }

  saveNotification(userId: number, articleId: number) {
    return this.repo.saveNotification(userId, articleId);
  }

  setKeywords(userId: number, keywords: string[]) {
    return this.repo.setKeywords(userId, keywords);
  }

  updatePreference(userId: number, categoryId: number, enabled: boolean) {
    return this.repo.updatePreference(userId, categoryId, enabled);
  }
}
