import { describe, expect, it, vi } from "vitest";

import { Server } from "../server.js";

describe("index.ts", () => {
  it("calls listen on Server instance", async () => {
    const listenSpy = vi.spyOn(Server.prototype, "listen").mockImplementation(() => {
      // do nothing
    });

    await import("../index.js");

    expect(listenSpy).toHaveBeenCalledTimes(1);

    listenSpy.mockRestore();
  });
});