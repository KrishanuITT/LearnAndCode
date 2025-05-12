import { DailyLimitExceededError, InsufficientFundsError, InvalidWithdrawalAmountError } from "./utilities/Errors";

export class BankAccount {
    private balance: number;
    private readonly dailyLimit: number;
    private dailyWithdrawnAmount: number;

    constructor(initialBalance: number) {
        this.balance = initialBalance;
        this.dailyLimit = 100000;
        this.dailyWithdrawnAmount = 0;
    }

    public withdraw(amount: number): void {
        try {
            if (amount <= 0) {
                throw new InvalidWithdrawalAmountError();
            }

            if (amount > this.balance) {
                throw new InsufficientFundsError();
            }

            if ((this.dailyWithdrawnAmount + amount) > this.dailyLimit) {
                throw new DailyLimitExceededError();
            }
            this.balance -= amount;
            this.dailyWithdrawnAmount += amount;
            console.log(`Withdrawal of ₹${amount} successful. Remaining balance: ₹${this.balance}`);
        } catch (err) {
            if (err instanceof Error) {
                console.error(`[${err.name}] ${err.message}`);
            } else {
                console.error(`[UnknownError] ${err}`);
            }
        }
    }

    public getBalance(): number {
        return this.balance;
    }

    public getDailyWithdrawn(): number {
        return this.dailyWithdrawnAmount;
    }
}
