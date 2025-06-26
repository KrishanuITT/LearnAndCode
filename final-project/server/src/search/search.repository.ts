import { db } from "../db.js";

export class SearchRepository {
  async searchArticles(query: string, start?: string, end?: string, sortBy?: string) {
    let sql = `
      SELECT 
        n.id, 
        n.title, 
        LEFT(n.content, 300) AS preview, 
        n.source, 
        n.url, 
        c.name AS category,
        COALESCE(SUM(CASE WHEN ld.is_like = 1 THEN 1 ELSE 0 END), 0) AS likes,
        COALESCE(SUM(CASE WHEN ld.is_like = 0 THEN 1 ELSE 0 END), 0) AS dislikes
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      LEFT JOIN likes_dislikes ld ON n.id = ld.news_id
      WHERE (n.title LIKE ? OR n.description LIKE ? OR n.content LIKE ?)
    `;

    const params = [`%${query}%`, `%${query}%`, `%${query}%`];

    if (start && end) {
      sql += " AND DATE(n.published_at) BETWEEN ? AND ?";
      params.push(start, end);
    }

    sql += " GROUP BY n.id ";

    if (sortBy === "likes") {
      sql += " ORDER BY likes DESC";
    } else if (sortBy === "dislikes") {
      sql += " ORDER BY dislikes DESC";
    } else {
      sql += " ORDER BY n.published_at DESC";
    }

    const [rows] = await db.query(sql, params);
    return rows;
  }
}
