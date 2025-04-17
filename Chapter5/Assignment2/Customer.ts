import Wallet from "./Wallet";

export default class Customer {
    private firstName: string;
    private lastName: string;
    private myWallet: Wallet;
  
    constructor(firstName: string, lastName: string, initialMoney: number = 0) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.myWallet = new Wallet(initialMoney);
    }
  
    getFirstName(): string {
      return this.firstName;
    }
  
    getLastName(): string {
      return this.lastName;
    }
  
    getWallet(): Wallet {
      return this.myWallet;
    }
  }