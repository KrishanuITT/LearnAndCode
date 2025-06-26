import { IMenuAction } from "../../interfaces/IMenuAction";
import { Authentication } from "../Authentication";

export class LoginAction implements IMenuAction {
  label = "Login";

  constructor(private auth: Authentication) {}

  async execute(): Promise<any> {
    return await this.auth.login();
  }
}
