import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserDTO } from "./User.dto.js";
import { AuthResponse, LoginData, SignupData } from "./User.model.js";
import { UserRepository } from "./User.repository.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "my-secret";
const JWT_EXPIRY = "7d";

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
    const token = this.generateToken(safeUser);
    return { token, user: safeUser };
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
    const token = this.generateToken(safeUser);
    return { token, user: safeUser };
  }

  private generateToken(user: UserDTO): string {
    return jwt.sign({ email: user.email, id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  }
}
