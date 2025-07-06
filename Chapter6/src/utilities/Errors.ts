import { ERROR_MESSAGES, ERROR_NAMES } from "./constants";

export class InsufficientFundsError extends Error {
    constructor() {
        super(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
        this.name = ERROR_NAMES.INSUFFICIENT_FUNDS;
    }
}

export class DailyLimitExceededError extends Error {
    constructor() {
        super(ERROR_MESSAGES.DAILY_LIMIT_EXCEEDED);
        this.name = ERROR_NAMES.DAILY_LIMIT_EXCEEDED;
    }
}

export class InvalidWithdrawalAmountError extends Error {
    constructor() {
        super(ERROR_MESSAGES.INVALID_WITHDRAWAL_AMOUNT);
        this.name = ERROR_NAMES.INVALID_WITHDRAWAL_AMOUNT;
    }
}

export class UnableToConnectToServerError extends Error {
    constructor() {
        super(ERROR_MESSAGES.UNABLE_TO_CONNECT);
        this.name = ERROR_NAMES.UNABLE_TO_CONNECT;
    }
}

export class InvalidPINError extends Error {
    constructor() {
        super(ERROR_MESSAGES.INVALID_PIN);
        this.name = ERROR_NAMES.INVALID_PIN;
    }
}

export class CardBlockedError extends Error {
    constructor() {
        super(ERROR_MESSAGES.CARD_BLOCKED);
        this.name = ERROR_NAMES.CARD_BLOCKED;
    }
}
