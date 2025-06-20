import { db } from "../db.js";

export class NotificationRepository {
  async disableKeyword(userId: number, keyword: string) {
    await db.query(`
      UPDATE notification_keywords
      SET enabled = 0
      WHERE user_id = ? AND keyword = ?
    `, [userId, keyword]);
  }

  async getKeywords(userId: number) {
    const [rows] = await db.query(`
      SELECT keyword, enabled FROM notification_keywords
      WHERE user_id = ?
    `, [userId]);
    return rows;
  }

  async getNotifications(userId: number) {
    const [rows] = await db.query(`
      SELECT n.article_id, a.title, a.url, a.category, a.source, n.created_at
      FROM notifications n
      JOIN news a ON n.article_id = a.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `, [userId]);
    return rows;
  }

  async getPreferences(userId: number) {
    const [rows] = await db.query(`
      SELECT np.id, c.name AS category, np.enabled
      FROM notification_preferences np
      JOIN categories c ON np.category_id = c.id
      WHERE np.user_id = ?
    `, [userId]);
    return rows;
  }

  async saveNotification(userId: number, articleId: number) {
    await db.query(`
      INSERT IGNORE INTO notifications (user_id, article_id)
      VALUES (?, ?)
    `, [userId, articleId]);
  }

  async setKeywords(userId: number, keywords: string[]) {
    for (const word of keywords) {
      await db.query(`
        INSERT INTO notification_keywords (user_id, keyword, enabled)
        VALUES (?, ?, 1)
        ON DUPLICATE KEY UPDATE enabled = 1
      `, [userId, word.trim()]);
    }
  }

  async updatePreference(userId: number, categoryId: number, enabled: boolean) {
    await db.query(`
      INSERT INTO notification_preferences (user_id, category_id, enabled)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE enabled = VALUES(enabled)
    `, [userId, categoryId, enabled]);
  }
}
