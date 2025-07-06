import { BankAccount } from "./BankAccount";
import { UnableToConnectToServerError } from "./utilities/Errors";

export class BankServer {
    private isConnected: boolean = true;

    setConnection(status: boolean) {
        this.isConnected = status;
    }

    processWithdrawal(account: BankAccount, amount: number): void {
        if (!this.isConnected) {
            throw new UnableToConnectToServerError();
        }

        account.withdraw(amount);
    }
}
