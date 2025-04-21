export class InsufficientFundsError extends Error {
    constructor() {
        super("Insufficient Balance!");
        this.name = "InsufficientFundsError";
    }
}

export class DailyLimitExceededError extends Error {
    constructor() {
        super("Daily Withdrawal Limit Exceeded!");
        this.name = "DailyLimitExceededError";
    }
}

export class InvalidWithdrawalAmountError extends Error {
    constructor() {
        super("Withdrawal amount must be greater than 0!");
        this.name = "InvalidWithdrawalAmountError";
    }
}

export class UnableToConnectToServerError extends Error{
    constructor(){
        super("Unable to connect to the bank server.")
        this.name = "UnableToConnectToServerError"
    }
}

export class InvalidPIN extends Error{
    constructor(){
        super("Invalid PIN.")
        this.name = "InvalidPIN"
    }
}

export class CardBlocked extends Error{
    constructor(){
        super("This card is blocked.");
        this.name = "CardBlocked";
    }
}
