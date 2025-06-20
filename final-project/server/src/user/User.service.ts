import bcrypt from "bcrypt";

import { UserDTO } from "./User.dto.js";
import { UserRepository } from "./User.repository.js";
import { AuthResponse, LoginData, SignupData } from "./User.types.js";

export class UserService {
  constructor(private repo: UserRepository) {}

  async login(data: LoginData): Promise<AuthResponse> {
    const user = await this.repo.findByEmail(data.email);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const safeUser = new UserDTO(user);
    return { user: safeUser };
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    const existingUser = await this.repo.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.repo.create({
      createdAt: new Date(),
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: "user",
      updatedAt: new Date(),
    });

    const safeUser = new UserDTO(newUser);
    return { user: safeUser };
  }
}
