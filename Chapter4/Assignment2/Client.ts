import { Customer } from "./Customer";

class PaymentProcessor {
  private paymentAmount: number;
  private customer: Customer;

  constructor(paymentAmount: number, firstName: string, lastName: string, initialAmount: number) {
    this.paymentAmount = paymentAmount;
    this.customer = new Customer(firstName, lastName, initialAmount);
  }

  processPayment(): void {
    console.log("I want my two dollars!");
    const theWallet = this.customer.getWallet();

    if (theWallet.getTotalMoney() > this.paymentAmount) {
      theWallet.subtractMoney(this.paymentAmount);
      console.log("Payment received.");
    } else {
      console.log("Come back later and get my money.");
    }
  }
}

const processor = new PaymentProcessor(2.0, "John", "Doe", 5.0);
processor.processPayment();
