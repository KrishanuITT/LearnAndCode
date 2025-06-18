import dotenv from "dotenv";
import { createPool, FieldPacket, Pool, PoolConnection, RowDataPacket } from "mysql2/promise";

dotenv.config({ path: "./.env" });

export class Database {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      connectionLimit: 10,
      database: process.env.DB_NAME ?? "test",
      host: process.env.DB_HOST ?? "localhost",
      password: process.env.DB_PASSWORD ?? "",
      port: Number(process.env.DB_PORT ?? 3306),
      queueLimit: 0,
      user: process.env.DB_USER ?? "root",
      waitForConnections: true,
    });
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }

  public async getConnection(): Promise<PoolConnection> {
    return await this.pool.getConnection();
  }
  public async query<T extends  RowDataPacket[] | RowDataPacket[][]>(sql: string, params: unknown[] = []): Promise<[T, FieldPacket[]]> {
    return await this.pool.query<T>(sql, params);
  }
}
