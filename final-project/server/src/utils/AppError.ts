import { Response } from "express";

import { Logger } from "./Logger.js";

export class AppError extends Error {
  public isOperational: boolean;
  public statusCode: number;
  private logger: Logger = new Logger();

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static handleUnknownError(error: unknown, res: Response): void {
    const logger = new Logger();
    logger.error(`[UnknownError] ${error instanceof Error ? error.message : String(error)}`);
    res.status(500).json({ error: "Internal Server Error" });
  }

  handle(res: Response): void {
    this.logger.error(`[AppError] ${this.message}`);
    res.status(this.statusCode).json({
      error: this.message,
    });
  }
}
