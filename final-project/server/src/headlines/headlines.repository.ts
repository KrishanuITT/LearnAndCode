import { db } from "../db.js";
import { News } from "./headlines.interface.js";

export class HeadlinesRepository {
  async fetchHeadlinesByDateRange(start: string, end: string, category?: string): Promise<News[]> {
    let query = `
      SELECT n.id, n.title, LEFT(n.content, 200) AS preview, n.source, n.url, c.name AS category
      FROM news n
      JOIN categories c ON n.category_id = c.id
      WHERE DATE(n.published_at) BETWEEN ? AND ?`;
    const params: string[] = [start, end];

    if (category) {
      query += " AND c.name = ?";
      params.push(category);
    }

    query += " ORDER BY n.published_at DESC";

    const [rows] = await db.query(query, params);
    return rows as News[];
  }

  async fetchTodayHeadlines(): Promise<News[]> {
    const [rows] = await db.query(
      `SELECT n.id, n.title, LEFT(n.content, 200) AS preview, n.source, n.url, c.name AS category
       FROM news n
       JOIN categories c ON n.category_id = c.id
       WHERE DATE(n.published_at) = CURDATE() - INTERVAL 1 DAY
       ORDER BY n.published_at DESC`
    );
    return rows as News[];
  }
}
