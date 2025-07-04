import { db } from "../db.js";
import { NotificationKeyword, NotificationPreference } from "./notifications.interface.js";

export class NotificationRepository {

  async deleteUserNotifications(userId: number): Promise<void> {
    const sql = `DELETE FROM notifications WHERE user_id = ?`;
    await db.query(sql, [userId]);
  }
  
  async disableKeyword(userId: number, keyword: string) {
    await db.query(
      `
      UPDATE notification_keywords
      SET enabled = 0
      WHERE user_id = ? AND keyword = ?
    `,
      [userId, keyword],
    );
  }

  async getKeywords(userId: number): Promise<NotificationKeyword[]> {
    const [rows] = await db.query(
      `
      SELECT keyword, enabled FROM notification_keywords
      WHERE user_id = ?
    `,
      [userId],
    );
    return rows as NotificationKeyword[];
  }

  async getNotifications(userId: number) {
    const [rows] = await db.query(
      `
      SELECT 
        n.news_id, 
        news.title, 
        news.url, 
        categories.name AS category, 
        news.source, 
        n.sent_at AS created_at
      FROM notifications n
      JOIN news ON n.news_id = news.id
      LEFT JOIN categories ON news.category_id = categories.id
      WHERE n.user_id = ?
      ORDER BY n.sent_at DESC
      `,
      [userId],
    );
    return rows;
  }

  async getPreferences(userId: number): Promise<NotificationPreference[]> {
    const [rows] = await db.query(
      `
      SELECT np.id, c.name AS category, np.enabled
      FROM notification_preferences np
      JOIN categories c ON np.category_id = c.id
      WHERE np.user_id = ?
    `,
      [userId],
    );
    return rows as NotificationPreference[];
  }

  async saveNotification(userId: number, newsId: number, message?: string) {
    await db.query(`INSERT INTO notifications (user_id, news_id, message) VALUES (?, ?, ?)`, [userId, newsId, message ?? null]);
  }

  async setKeywords(userId: number, keywords: string[]) {
    for (const word of keywords) {
      await db.query(
        `
        INSERT INTO notification_keywords (user_id, keyword, enabled)
        VALUES (?, ?, 1)
        ON DUPLICATE KEY UPDATE enabled = 1
      `,
        [userId, word.trim()],
      );
    }
  }

  async updatePreference(userId: number, categoryId: number, enabled: boolean) {
    await db.query(
      `
      INSERT INTO notification_preferences (user_id, category_id, enabled)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE enabled = VALUES(enabled)
    `,
      [userId, categoryId, enabled],
    );
  }
}
