import { ResultSetHeader, RowDataPacket } from "mysql2";

import { db } from "../db.js";
import { User } from "./User.model.js";

export class UserRepository {
  async create(user: Omit<User, "id">): Promise<User> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Insert into `users` (omit id, it's auto-generated)
      const [userResult]: [ResultSetHeader, unknown] = await connection.execute(
        `INSERT INTO users (name, email, password, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)`,
        [user.name, user.email, user.password, user.createdAt, user.updatedAt]
      );

      const newUserId = userResult.insertId;

      // 2. Fetch or insert role
      const [roleRows]: [RowDataPacket[], unknown] = await connection.execute(
        `SELECT id FROM roles WHERE name = ?`,
        [user.role]
      );

      let roleId: number;
      if (roleRows.length > 0) {
        roleId = roleRows[0].id;
      } else {
        const [roleResult]: [ResultSetHeader, unknown] = await connection.execute(
          `INSERT INTO roles (name) VALUES (?)`,
          [user.role]
        );
        roleId = roleResult.insertId;
      }

      // 3. Insert into user_roles
      await connection.execute(
        `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
        [newUserId, roleId]
      );

      await connection.commit();

      return {
        id: newUserId,
        ...user,
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async findByEmail(email: string): Promise<null | User > {
    const [rows]: [RowDataPacket[], unknown] = await db.query(
      `SELECT u.id, u.name, u.email, u.password, u.created_at AS createdAt, u.updated_at AS updatedAt, r.name AS role
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      createdAt: row.createdAt,
      email: row.email,
      id: row.id,
      name: row.name,
      password: row.password,
      role: row.role,
      updatedAt: row.updatedAt,
    };
  }
  
  async getAllUsersWithEmail() {
    const [rows] = await db.query(`
      SELECT id, email FROM users WHERE email IS NOT NULL
    `);
    return rows;
  }
}
