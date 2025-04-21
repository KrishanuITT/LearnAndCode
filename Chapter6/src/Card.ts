import { CardBlocked } from "./Errors";

export class Card {
    cardNumber: number;
    private pin: number;
    isBlocked: boolean;
    private pinAttempts: number;

    constructor(cardNumber: number, pin: number) {
        this.cardNumber = cardNumber;
        this.pin = pin;
        this.isBlocked = false;
        this.pinAttempts = 3;
    }

    validatePin(inputPin: number): boolean {
        if (this.isBlocked) {
            throw new CardBlocked();
        }

        if (inputPin === this.pin) {
            this.pinAttempts = 3;
            return true;
        } else {
            this.pinAttempts--;
            if (this.pinAttempts <= 0) {
                this.isBlocked = true;
                throw new CardBlocked();
            }
            return false;
        }
    }

    getRemainingAttempts(): number {
        return this.pinAttempts;
    }
}
