import { db } from "#db.js";
import { Logger } from "#utils/Logger.js";
import { NextFunction, Request, Response } from "express";
import { RowDataPacket } from "mysql2";

export interface AuthenticatedRequest extends Request {
  user: {
    email: string;
    id: number;
    role?: string;
  };
}

const logger = new Logger();

export async function isAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { user } = req as AuthenticatedRequest;

  if (!user.id) {
    res.status(401).json({ error: "Unauthorized: User not found" });
    return;
  }

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT r.name AS role
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE u.id = ?
      `,
      [user.id],
    );

    const userFromDb = rows[0] as RowDataPacket & { role: string };

    if (userFromDb.role !== "admin") {
      res.status(403).json({ error: "Forbidden: Admins only" });
      return;
    }

    next();
  } catch (error) {
    logger.error(`isAdmin error: ${JSON.stringify(error)}`);
    res.status(500).json({ error: "Internal server error" });
  }
}
