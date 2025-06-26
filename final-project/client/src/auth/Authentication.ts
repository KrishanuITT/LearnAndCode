import { Prompt } from "../../utils/prompt";
import { SessionStore } from "../../utils/sessionStorage.js";

export class Authentication {
  private prompter: Prompt;
  private readonly BASE_URL = "http://localhost:5000/users";

  constructor(prompter: Prompt) {
    this.prompter = prompter;
  }

  public async login(): Promise<any> {
    const email = this.prompter.prompt("Enter your email: ");
    const password = this.prompter.prompt("Enter your password: ");

    try {
      const response = await fetch(`${this.BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      SessionStore.setUserId(data.user.id.toString());
      if (!response.ok) {
        console.error("Error:", data.message || response.statusText);
        return null;
      }
      return data.user; 
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  public async signup(): Promise<any> {
    const name = this.prompter.prompt("Enter your name: ");
    const email = this.prompter.prompt("Enter your email: ");
    const password = this.prompter.prompt("Enter your password: ");

    try {
      const response = await fetch(`${this.BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error:", data.message || response.statusText);
        return null;
      }
      return data.user; 
    } catch (error) {
      console.error("Network error:", error);
    }
  }
}
