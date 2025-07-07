/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserDTO } from "../../user/User.dto.js";
import { LoginData, SignupData } from "../../user/User.model.js";
import { UserRepository } from "../../user/User.repository.js";
import { UserService } from "../../user/User.service.js";

vi.mock("bcrypt");
vi.mock("jsonwebtoken");

describe("UserService", () => {
  const mockRepo = {
    create: vi.fn(),
    findByEmail: vi.fn(),
  } as unknown as UserRepository;

  const service = new UserService(mockRepo);

  const mockUser = {
    createdAt: new Date(),
    email: "krishanu@example.com",
    id: 1,
    name: "Krishanu",
    password: "hashed-password",
    role: "user",
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should return token and user on successful login", async () => {
      mockRepo.findByEmail = vi.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);
      (jwt.sign as any).mockReturnValue("mock-token");

      const loginData: LoginData = {
        email: mockUser.email,
        password: "plain-password",
      };

      const result = await service.login(loginData);

      expect(mockRepo.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(result).toEqual({
        token: "mock-token",
        user: new UserDTO(mockUser),
      });
    });

    it("should throw error if user not found", async () => {
      mockRepo.findByEmail = vi.fn().mockResolvedValue(null);

      await expect(service.login({ email: "unknown@example.com", password: "123" })).rejects.toThrow("User not found");
    });

    it("should throw error if password doesn't match", async () => {
      mockRepo.findByEmail = vi.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(false);

      await expect(service.login({ email: mockUser.email, password: "wrong" })).rejects.toThrow("Invalid credentials");
    });
  });

  describe("signup", () => {
    it("should create a new user and return token", async () => {
      mockRepo.findByEmail = vi.fn().mockResolvedValue(null);
      (bcrypt.hash as any).mockResolvedValue("hashed-password");
      mockRepo.create = vi.fn().mockResolvedValue({ ...mockUser, password: "hashed-password" });
      (jwt.sign as any).mockReturnValue("signup-token");

      const signupData: SignupData = {
        email: "krishanu@example.com",
        name: "Krishanu",
        password: "plain-password",
      };

      const result = await service.signup(signupData);

      expect(bcrypt.hash).toHaveBeenCalledWith(signupData.password, 10);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(result).toEqual({
        token: "signup-token",
        user: new UserDTO({ ...mockUser, password: "hashed-password" }),
      });
    });

    it("should throw error if email already registered", async () => {
      mockRepo.findByEmail = vi.fn().mockResolvedValue(mockUser);

      await expect(
        service.signup({
          email: "krishanu@example.com",
          name: "Krishanu",
          password: "123",
        }),
      ).rejects.toThrow("Email already registered");
    });
  });
});
