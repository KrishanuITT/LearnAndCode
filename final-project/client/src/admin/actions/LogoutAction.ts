import { IMenuAction } from "../../interfaces/IMenuAction.js";

export class LogoutAction implements IMenuAction {
  label = "Logout";

  constructor(private onLogout: () => void) {}

  async execute(): Promise<void> {
    console.log("Logged out from admin panel.");
    this.onLogout();
  }
}
