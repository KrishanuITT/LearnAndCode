import { db } from "../db.js";
import { ExternalServerDTO } from "./DTOs/ExternalServerDTO.js";
import { NewsDTO } from "./DTOs/NewsAPIDTO.js";
import { ExternalServer } from "./interfaces/ExternalServer.interface.js";

export class ExternalAPIRepository {
  async bulkSave(newsList: unknown[]): Promise<void> {
    for (const news of newsList) {
      await this.save(news);
    }
  }

  async getLatestArticles(sinceMinutesAgo = 10): Promise<NewsDTO[]> {
    const [rows] = await db.query(
      `
      SELECT 
        n.id, n.title, n.description, n.content, n.image_url AS imageUrl,
        n.published_at AS publishedAt, n.url, n.source, c.name AS category
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      WHERE n.published_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
      ORDER BY n.published_at DESC;
      `,
      [sinceMinutesAgo * 60 * 1000],
    );
    return rows as NewsDTO[];
  }

  async listAllServers(): Promise<ExternalServerDTO[]> {
    const [rows] = await db.query("SELECT id, name, is_active, last_accessed, api_key FROM external_servers");
    return (rows as ExternalServer[]).map((row) => new ExternalServerDTO(row));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async save(news: any): Promise<void> {
    let categoryId = 1;

    if (news.category) {
      const [rows] = await db.query(
        `INSERT INTO categories (name) VALUES (?) 
     ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);`,
        [news.category],
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categoryId = (rows as any).insertId;
    }

    const query = `
  INSERT INTO news (
    title, description, content, image_url, published_at, url, source, category_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    description = VALUES(description),
    content = VALUES(content),
    image_url = VALUES(image_url),
    published_at = VALUES(published_at),
    source = VALUES(source),
    category_id = VALUES(category_id);
`;

    const values = [news.title, news.description, news.content, news.imageUrl, news.publishedAt, news.url, news.source, categoryId];

    await db.query(query, values);
  }

  async updateServer(id: string, key: string): Promise<ExternalServerDTO> {
    await db.query("UPDATE external_servers SET api_key = ?, updated_at = NOW() WHERE id = ?", [key, id]);

    const [rows] = await db.query("SELECT id, name, is_active, last_accessed FROM external_servers WHERE id = ?", [id]);

    if (rows.length === 0) {
      throw new Error(`External server with ID ${id} not found`);
    }

    return rows[0] as ExternalServerDTO;
  }
}
