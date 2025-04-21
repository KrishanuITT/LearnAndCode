import { Prompt } from "./Prompt";
import { ATM } from "./ATM";
import { BankAccount } from "./BankAccount";
import { Card } from "./Card";
import { BankServer } from "./BankServer";

export class Index {
    private prompt: Prompt;
    private server: BankServer;
    private account: BankAccount;
    private card: Card;
    private atm: ATM;

    constructor() {
        this.prompt = new Prompt();
        this.server = new BankServer();
        this.account = new BankAccount(1000000);
        this.card = new Card(123456, 1234);
        this.atm = new ATM(this.server, 1000000);
    }

    run(): void {
        console.log("=== Welcome to the ATM ===");

        while (true) {
            if (this.card.isBlocked) {
                console.log("This card is blocked. Exiting...");
                break;
            }

            const pinInput = parseInt(this.prompt.prompt("Please enter your PIN: "));
            try {
                if (!this.card.validatePin(pinInput)) {
                    console.log(`Invalid PIN. Remaining attempts: ${this.card.getRemainingAttempts()}`);
                    continue;
                }
            } catch (err: any) {
                console.error(err.message);
                break;
            }

            while (true) {
                const amountInput = this.prompt.prompt("Enter amount to withdraw (or type 'exit' to quit): ");
                if (amountInput.toLowerCase() === "exit") {
                    console.log("Exiting ATM. Have a nice day!");
                    return;
                }

                const amount = parseInt(amountInput);
                if (isNaN(amount) || amount <= 0) {
                    console.log("Invalid amount. Please try again.");
                    continue;
                }

                try {
                    this.atm.withdraw(this.card, pinInput, this.account, amount);
                    console.log(`Withdrawal successful. Remaining balance: $${this.account.getBalance()}`);
                } catch (err: any) {
                    console.error("Transaction failed:", err.message);
                }

                const again = this.prompt.prompt("Would you like to make another transaction? (yes/no): ");
                if (again.toLowerCase() !== "yes") {
                    console.log("Thank you for using our ATM. Goodbye!");
                    return;
                }
            }
        }
    }
}

const app = new Index();
app.run();