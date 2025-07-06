/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { AppError } from "#utils/AppError.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ExternalAPIController } from "../../externalAPIs/ExternalAPI.controller.js";
import { ExternalAPIService } from "../../externalAPIs/ExternalAPI.service.js";

describe("ExternalAPIController", () => {
  let controller: ExternalAPIController;
  let service: ExternalAPIService;

  const req: any = { body: {} };
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  const res: any = { status };

  beforeEach(() => {
    json.mockReset();
    status.mockReset();

    service = {
      fetchAllNews: vi.fn(),
      listAllServers: vi.fn(),
      saveNewsToDatabase: vi.fn(),
      updateServer: vi.fn()
    } as unknown as ExternalAPIService;

    controller = new ExternalAPIController(service);
  });

  it("should return all news", async () => {
    const mockNews = [{ title: "Mock" }];
    (service.fetchAllNews as any).mockResolvedValue(mockNews);

    await controller.getAll(req, res);

    expect(service.fetchAllNews).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(mockNews);
  });

  it("should return all servers", async () => {
    const mockServers = [{ id: "1", name: "Server A" }];
    (service.listAllServers as any).mockResolvedValue(mockServers);

    await controller.listAllServers(req, res);

    expect(service.listAllServers).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(mockServers);
  });

  it("should fetch and save news, and return success message", async () => {
    const mockNews = [{ title: "Today" }];
    (service.fetchAllNews as any).mockResolvedValue(mockNews);
    (service.saveNewsToDatabase as any).mockResolvedValue(undefined);

    await controller.refreshAndSave(req, res);

    expect(service.fetchAllNews).toHaveBeenCalled();
    expect(service.saveNewsToDatabase).toHaveBeenCalledWith(mockNews);
    expect(status).toHaveBeenCalledWith(200);
    expect(json.mock.calls[0][0]).toMatch(/News successfully updated/);
  });

  it("should update a server and return it", async () => {
    req.body = { id: "123", key: "abc" };
    const updatedServer = { id: "123", isActive: true, key: "abc" };
    (service.updateServer as any).mockResolvedValue(updatedServer);

    await controller.updateServer(req, res);

    expect(service.updateServer).toHaveBeenCalledWith("123", "abc");
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(updatedServer);
  });

  it("should call AppError.handle if AppError is thrown", async () => {
    const handle = vi.fn();
    const error = new AppError("Bad", 400);
    error.handle = handle;

    (service.fetchAllNews as any).mockRejectedValue(error);

    await controller.getAll(req, res);

    expect(handle).toHaveBeenCalledWith(res);
  });

  it("should call AppError.handleUnknownError for non-AppError", async () => {
    const err = new Error("Unexpected");
    const spy = vi.spyOn(AppError, "handleUnknownError").mockImplementation(() => {});

    (service.fetchAllNews as any).mockRejectedValue(err);

    await controller.getAll(req, res);

    expect(spy).toHaveBeenCalledWith(err, res);
    spy.mockRestore();
  });
});
