import { RowDataPacket } from "mysql2";

import { db } from "../db.js";
import { News } from "./headlines.interface.js";

export class HeadlinesRepository {
  async fetchHeadlinesByDateRange(start: string, end: string, category?: string): Promise<News[]> {
    let query = `
      SELECT n.id, n.title, LEFT(n.content, 200) AS preview, n.source, n.url, c.name AS category
      FROM news n
      JOIN categories c ON n.category_id = c.id
      WHERE c.is_hidden = FALSE AND n.is_hidden = FALSE AND DATE(n.published_at) BETWEEN ? AND ?`;

    const params: string[] = [start, end];

    if (category) {
      query += " AND c.name = ?";
      params.push(category);
    }

    query += " ORDER BY n.published_at DESC";

    const [rows] = await db.query<RowDataPacket[]>(query, params);
    const news = rows as News[];

    const keywords = await this.getFilteredKeywords();
    return this.filterNews(news, keywords);
  }

  async fetchPersonalizedNews(userId: number): Promise<News[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
  n.id, 
  n.title, 
  LEFT(n.content, 200) AS preview, 
  n.source, 
  n.url, 
  c.name AS category,
  (np.user_id IS NOT NULL) AS has_pref,
  (nk.user_id IS NOT NULL) AS has_keyword,
  (sa.user_id IS NOT NULL) AS has_saved,
  (ld.user_id IS NOT NULL) AS has_liked,
  (rh.user_id IS NOT NULL) AS has_read
FROM news n
JOIN categories c ON n.category_id = c.id
LEFT JOIN notification_preferences np ON np.category_id = c.id AND np.user_id = ?
LEFT JOIN notification_keywords nk ON LOWER(n.title) LIKE CONCAT('%', LOWER(nk.keyword), '%') AND nk.user_id = ?
LEFT JOIN saved_articles sa ON sa.news_id = n.id AND sa.user_id = ?
LEFT JOIN likes_dislikes ld ON ld.news_id = n.id AND ld.user_id = ? AND ld.is_like = 1
LEFT JOIN read_history rh ON rh.news_id = n.id AND rh.user_id = ?
WHERE c.is_hidden = FALSE AND n.is_hidden = FALSE
ORDER BY 
  has_pref DESC,
  has_keyword DESC,
  has_saved DESC,
  has_liked DESC,
  has_read DESC,
  n.published_at DESC
LIMIT 50;
`,
      [userId, userId, userId, userId, userId],
    );
    const news = rows as News[];
    const keywords = await this.getFilteredKeywords();
    return this.filterNews(news, keywords);
  }

  async fetchTodayHeadlines(): Promise<News[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT n.id, n.title, LEFT(n.content, 200) AS preview, n.source, n.url, c.name AS category
       FROM news n
       JOIN categories c ON n.category_id = c.id
       WHERE c.is_hidden = FALSE AND n.is_hidden = FALSE AND DATE(n.published_at) = CURDATE() - INTERVAL 1 DAY
       ORDER BY n.published_at DESC`,
    );

    const news = rows as News[];
    const keywords = await this.getFilteredKeywords();
    return this.filterNews(news, keywords);
  }

  private filterNews(news: News[], keywords: string[]): News[] {
    if (keywords.length === 0) return news;

    return news.filter((article) => {
      const text = `${article.title} ${article.preview}`.toLowerCase();
      return !keywords.some((keyword) => text.includes(keyword));
    });
  }

  private async getFilteredKeywords(): Promise<string[]> {
    const [rows] = await db.query<RowDataPacket[]>("SELECT keyword FROM filtered_keywords");
    return rows.map((row) => row.keyword.toLowerCase());
  }
}
