export class Logger {
  public error(message: string): void {
    console.error(`[${new Date().toISOString()}] ${message}`);
  }
  public log(message: string): void {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
  public warn(message: string): void {
    console.warn(`[${new Date().toISOString()}] ${message}`);
  }
}
