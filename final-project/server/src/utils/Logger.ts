import fs from "fs";
import path from "path";

export class Logger {
  private logDir = path.resolve("logs");

  constructor() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  public error(message: string): void {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${message}`);
    this.writeToFile("error", message);
  }

  public log(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
    this.writeToFile("log", message);
  }

  public warn(message: string): void {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] ${message}`);
    this.writeToFile("warn", message);
  }

  private getLogFilePath(): string {
    const date = new Date().toISOString().split("T")[0];
    return path.join(this.logDir, `${date}.log`);
  }

  private writeToFile(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

    fs.appendFile(this.getLogFilePath(), logLine, (err) => {
      if (err) {
        console.error(`Failed to write log: ${err.message}`);
      }
    });
  }
}
