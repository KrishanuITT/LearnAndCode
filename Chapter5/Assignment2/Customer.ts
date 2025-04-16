class Wallet {
    private value: number;
  
    constructor(initialValue: number = 0) {
      this.value = initialValue;
    }
  
    getTotalMoney(): number {
      return this.value;
    }
  
    setTotalMoney(newValue: number): void {
      this.value = newValue;
    }
  
    addMoney(deposit: number): void {
      this.value += deposit;
    }
  
    subtractMoney(debit: number): void {
      this.value -= debit;
    }
  }
  
class Customer {
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
  
export {Customer,Wallet}
