import { db } from "../db.js";

export class ExternalAPIRepository {
  async bulkSave(newsList: unknown[]): Promise<void> {
    for (const news of newsList) {
      await this.save(news);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async save(news: any): Promise<void> {
    let categoryId: null | number = null;

    // Step 1: Insert/find category
    if (news.category) {
      const [rows] = await db.query(
        `INSERT INTO categories (name) VALUES (?) 
         ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);`,
        [news.category]
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categoryId = (rows as any).insertId;
    }

    // Step 2: Save news with category_id
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

    const values = [
      news.title,
      news.description,
      news.content,
      news.imageUrl,
      news.publishedAt,
      news.url,
      news.source,
      categoryId,
    ];

    await db.query(query, values);
  }
}
