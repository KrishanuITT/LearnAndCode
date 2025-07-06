import bodyParser from "body-parser";
import express, { Express } from "express";
import supertest from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserController } from "../../user/User.controller.js";
import { UserDTO } from "../../user/User.dto.js";
import { LoginData, SignupData } from "../../user/User.model.js";
import { UserService } from "../../user/User.service.js";

describe("UserController", () => {
  let app: Express;
  let mockService: UserService;

  const userDto: UserDTO = {
    email: "test@example.com",
    id: 1,
    name: "Test User",
    role: "user",
  };

  const mockToken = "mock.jwt.token";

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());

    // Create a mock UserService
    mockService = {
      login: vi.fn(),
      signup: vi.fn(),
    } as unknown as UserService;

    const controller = new UserController(mockService);
    app.post("/login", controller.login);
    app.post("/signup", controller.signup);
  });

  it("should return token and user on successful login", async () => {
    const loginData: LoginData = {
      email: "test@example.com",
      password: "password123",
    };

    vi.spyOn(mockService, "login").mockResolvedValue({ token: mockToken, user: userDto });

    const res = await supertest(app).post("/login").send(loginData);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      token: mockToken,
      user: userDto,
    });
    expect(mockService.login).toHaveBeenCalledWith(loginData);
  });

  it("should return 401 on login failure", async () => {
    const loginData: LoginData = {
      email: "fail@example.com",
      password: "wrongpass",
    };

    vi.spyOn(mockService, "login").mockRejectedValue(new Error("Invalid credentials"));

    const res = await supertest(app).post("/login").send(loginData);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "Invalid credentials",
    });
    expect(mockService.login).toHaveBeenCalledWith(loginData);
  });

  it("should return token and user on successful signup", async () => {
    const signupData: SignupData = {
      email: "new@example.com",
      name: "New User",
      password: "securepass",
    };

    vi.spyOn(mockService, "signup").mockResolvedValue({ token: mockToken, user: userDto });

    const res = await supertest(app).post("/signup").send(signupData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      token: mockToken,
      user: userDto,
    });
    expect(mockService.signup).toHaveBeenCalledWith(signupData);
  });

  it("should return 400 on signup error", async () => {
    const signupData: SignupData = {
      email: "fail@example.com",
      name: "Fail User",
      password: "badpass",
    };

    vi.spyOn(mockService, "signup").mockRejectedValue(new Error("Email already registered"));

    const res = await supertest(app).post("/signup").send(signupData);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
