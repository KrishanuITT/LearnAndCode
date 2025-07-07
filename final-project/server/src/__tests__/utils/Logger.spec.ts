/* eslint-disable @typescript-eslint/no-empty-function */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Logger } from "../../utils/Logger.js";

describe("Logger", () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-07-05T12:00:00Z"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should call console.log with formatted timestamp", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.log("Test log");

    expect(spy).toHaveBeenCalledWith("[2025-07-05T12:00:00.000Z] Test log");
  });

  it("should call console.error with formatted timestamp", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("Test error");

    expect(spy).toHaveBeenCalledWith("[2025-07-05T12:00:00.000Z] Test error");
  });

  it("should call console.warn with formatted timestamp", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("Test warning");

    expect(spy).toHaveBeenCalledWith("[2025-07-05T12:00:00.000Z] Test warning");
  });
});
