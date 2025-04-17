export default class Wallet {
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
  