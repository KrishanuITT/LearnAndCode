class Employee {
    private _name: string;
    private _age: number;
    private _salary: number;
  
    public getName(): string {
      return this._name;
    }
  
    public setName(name: string): void {
      this._name = name;
    }
  
    public getAge(): number {
      return this._age;
    }
  
    public setAge(age: number): void {
      this._age = age;
    }
  
    public getSalary(): number {
      return this._salary;
    }
  
    public setSalary(salary: number): void {
      this._salary = salary;
    }
  }
  
/*  Is 'Employee' an object or a data structure? Why?
    Employee Class is a Data Structure.
    I think Employee Class is a Data Structure because
        - It rather than working on logic, it is showing the internal state by using getter and setters.
        - All the member function do not have any logic inside of them they are just setting or returning the data. 
*/
