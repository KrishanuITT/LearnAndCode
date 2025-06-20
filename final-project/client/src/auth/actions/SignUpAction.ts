import { IMenuAction } from "../../interfaces/IMenuAction";
import { Authentication } from "../Authentication";

export class SignupAction implements IMenuAction {
  constructor(private auth: Authentication) {}

  label = "Signup";

  execute(): Promise<any> {
    return this.auth.signup();
  }
}
