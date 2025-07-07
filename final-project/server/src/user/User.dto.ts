import { User } from "./User.model.js";

export class UserDTO {
  email: string;
  id: number;
  name: string;
  role: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
  }
}
