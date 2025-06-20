/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "../db.js";

export class SavedArticlesRepository {
  async deleteArticle(userId: number, newsId: number): Promise<void> {
    await db.query(
      "DELETE FROM saved_articles WHERE user_id = ? AND news_id = ?",
      [userId, newsId]
    );
  }

  async getSavedArticles(userId: number): Promise<any[]> {
    const [rows] = await db.query(
      `SELECT n.id, n.title, LEFT(n.content, 200) AS preview, n.source, n.url, c.name AS category
       FROM saved_articles sa
       JOIN news n ON sa.news_id = n.id
       JOIN categories c ON n.category_id = c.id
       WHERE sa.user_id = ?
       ORDER BY sa.saved_at DESC`,
      [userId]
    );
    return rows as any[];
  }

  async saveArticle(userId: number, newsId: number): Promise<void> {
    await db.query(
      "INSERT INTO saved_articles (user_id, news_id) VALUES (?, ?)",
      [userId.toString(), newsId.toString()]
    );
  }
}
