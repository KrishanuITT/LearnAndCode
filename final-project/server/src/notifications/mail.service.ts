import { NewsDTO } from "#externalAPIs/DTOs/NewsAPIDTO.js";
import { UserDTO } from "#user/User.dto.js";
import { sendNotificationEmail } from "#utils/mailer.js";

import { UserRepository } from "../user/User.repository.js";
import { NotificationRepository } from "./notifications.repository.js";

export class NewsIngestionService {
  constructor(
    private notificationRepository: NotificationRepository,
    private userRepository: UserRepository,
  ) {}

  async checkAndNotifyUsers(articles: NewsDTO[]): Promise<void> {
    const allUsers = (await this.userRepository.getAllUsersWithEmail()) as UserDTO[];

    for (const user of allUsers) {
      const prefs = await this.notificationRepository.getPreferences(user.id);
      const keywords = await this.notificationRepository.getKeywords(user.id);

      const matchingArticles = articles.filter(
        (article) =>
          prefs.some((p) => p.enabled && p.category === article.category) ||
          keywords.some((k) => k.enabled && article.title.toLowerCase().includes(k.keyword.toLowerCase())),
      );

      if (matchingArticles.length === 0) continue;

      for (const article of matchingArticles) {
        await this.notificationRepository.saveNotification(user.id, article.id, article.title);
      }

      await sendNotificationEmail(user.email, matchingArticles);
    }
  }
}
