import { NewsDTO } from "#externalAPIs/DTOs/NewsAPIDTO.js";
import { UserDTO } from "#user/User.dto.js";
import { sendNotificationEmail } from "#utils/mailer.js";

import { UserRepository } from "../user/User.repository.js";
import { NotificationRepository } from "./notifications.repository.js";

export class NewsIngestionService {
  constructor(
    private notifRepo: NotificationRepository,
    private userRepo: UserRepository
  ) {}

  async checkAndNotifyUsers(articles: NewsDTO[]) {
    const allUsers = await this.userRepo.getAllUsersWithEmail() as UserDTO[];
    for (const user of allUsers) {
      const prefs = await this.notifRepo.getPreferences(user.id);
      const keywords = await this.notifRepo.getKeywords(user.id);

      const matchesCategory = prefs.some(p => p.category === article.category && p.enabled);
      const matchesKeyword = keywords.some(k => k.enabled && article.title.toLowerCase().includes(k.keyword.toLowerCase()));

      if (matchesCategory || matchesKeyword) {
        for(const article of articles) {
            await this.notifRepo.saveNotification(user.id, article.id);
        }
        await sendNotificationEmail(user.email, articles);
      }
    }
  }
}
