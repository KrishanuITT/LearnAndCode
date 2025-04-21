import { Card } from "./Card";
import { BankAccount } from "./BankAccount";
import { BankServer } from "./BankServer";
import { CardBlocked, InsufficientFundsError, InvalidPIN } from "./Errors";

export class ATM {
    private cashInMachine: number;

    constructor(private bankServer: BankServer, initialCash: number) {
        this.cashInMachine = initialCash;
    }

    withdraw(card: Card, pin: number, account: BankAccount, amount: number) {
        if (card.isBlocked) {
            throw new CardBlocked();
        }

        if (!card.validatePin(pin)) {
            throw new InvalidPIN();
        }

        if (amount > this.cashInMachine) {
            throw new InsufficientFundsError();
        }

        this.bankServer.processWithdrawal(account, amount);
        this.cashInMachine -= amount;

        console.log(`Please collect your cash: $${amount}`);
    }

    getCashInMachine(): number {
        return this.cashInMachine;
    }
}
