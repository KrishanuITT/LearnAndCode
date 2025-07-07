import { NotificationRepository } from "./notifications.repository.js";

export class NotificationService {
  constructor(private repository: NotificationRepository) {}

  clearUserNotifications(userId: number) {
    return this.repository.deleteUserNotifications(userId);
  }  

  disableKeyword(userId: number, keyword: string) {
    return this.repository.disableKeyword(userId, keyword);
  }

  getKeywords(userId: number) {
    return this.repository.getKeywords(userId);
  }

  getNotifications(userId: number) {
    return this.repository.getNotifications(userId);
  }

  getPreferences(userId: number) {
    return this.repository.getPreferences(userId);
  }

  saveNotification(userId: number, articleId: number) {
    return this.repository.saveNotification(userId, articleId);
  }

  setKeywords(userId: number, keywords: string[]) {
    return this.repository.setKeywords(userId, keywords);
  }

  updatePreference(userId: number, categoryId: number, enabled: boolean) {
    return this.repository.updatePreference(userId, categoryId, enabled);
  }
}
