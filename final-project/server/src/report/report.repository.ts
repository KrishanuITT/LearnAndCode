import { db } from "#db.js";
import { RowDataPacket } from "mysql2";

export class ReportRepository {
  async getReportCount(newsId: number): Promise<number> {
    const [rows] = await db.query<RowDataPacket[]>("SELECT COUNT(*) AS count FROM reports WHERE news_id = ?", [newsId]);
    return rows[0]?.count;
  }

  async getReportedNewsNotHidden(): Promise<RowDataPacket[]> {
    const [rows] = await db.query(`
      SELECT n.id, n.title, COUNT(r.id) AS report_count
      FROM news n
      JOIN reports r ON n.id = r.news_id
      WHERE n.is_hidden = FALSE
      GROUP BY n.id, n.title
      HAVING report_count > 0
      ORDER BY report_count DESC
    `);
    return rows as RowDataPacket[];
  }

  async hasUserReported(userId: number, newsId: number): Promise<boolean> {
    const [rows] = await db.query("SELECT 1 FROM reports WHERE user_id = ? AND news_id = ?", [userId, newsId]);
    return Array.isArray(rows) && rows.length > 0;
  }

  async hideNews(newsId: number): Promise<void> {
    await db.query("UPDATE news SET is_hidden = TRUE WHERE id = ?", [newsId]);
  }

  async saveReport(userId: number, newsId: number): Promise<void> {
    await db.query("INSERT INTO reports (user_id, news_id) VALUES (?, ?)", [userId, newsId]);
  }
}
