import { IMenuAction } from "../../interfaces/IMenuAction";

export class ExitAction implements IMenuAction {
  label = "Exit";

  private exitCallback: () => void;

  constructor(exitCallback: () => void) {
    this.exitCallback = exitCallback;
  }

  execute(): void {
    console.log("Goodbye!");
    this.exitCallback(); // Triggers stopping the main loop
  }
}
