import { db } from "../db.js";
import { Category } from "./categories.model.js";

export class CategoriesRepository {
  async findAll() {
    const [rows] = await db.query("SELECT * FROM categories");
    return rows;
  }

  async findByName(name: string): Promise<Category | null> {
    const [rows] = await db.query("SELECT * FROM categories WHERE name = ?", [name]);
    return rows[0] as Category;
  }

  async insert(name: string): Promise<Category> {
    const [result] = await db.query("INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)", [name]);

    const insertId = (result as unknown as { insertId: number }).insertId;

    const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [insertId]);

    return rows[0] as Category;
  }
  
}
