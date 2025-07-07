import { beforeAll, describe, expect, it } from "vitest";

import { Database } from "../db.js";

let db: Database;

describe("Database class", () => {
  beforeAll(() => {
    process.env.DB_NAME = "mydb";
    process.env.DB_HOST = "localhost";
    process.env.DB_USER = "root";
    process.env.DB_PASSWORD = "my-secret-pw";
    process.env.DB_PORT = "3306";

    db = new Database();
  });

  it("should get a database connection", async () => {
    const connection = await db.getConnection();
    expect(connection).toBeDefined();
    connection.release();
  });

  it("should execute a query successfully", async () => {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    expect(Array.isArray(rows)).toBe(true);
    expect(rows[0]).toHaveProperty("result", 2);
  });

  it("should close the database connection pool", async () => {
    await expect(db.close()).resolves.not.toThrow();
  });
});
