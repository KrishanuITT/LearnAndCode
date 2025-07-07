import { RowDataPacket } from "mysql2";

import { db } from "../db.js";

export class AdminRepository {
  async addKeyword(keyword: string): Promise<void> {
    await db.query("INSERT INTO filtered_keywords (keyword) VALUES (?)", [keyword]);
  }

  async deleteKeyword(keyword: string): Promise<void> {
    await db.query("DELETE FROM filtered_keywords WHERE keyword = ?", [keyword]);
  }

  async getAllKeywords(): Promise<string[]> {
    const [rows] = await db.query<RowDataPacket[]>("SELECT keyword FROM filtered_keywords");
    return rows.map((row) => row.keyword);
  }

  async updateQueryStatus(hide: boolean, categoryId: number) {
    await db.query("UPDATE categories SET is_hidden = ? WHERE id = ?", [hide, categoryId]);
  }
}
