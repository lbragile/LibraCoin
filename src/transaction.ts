export class Transaction {
  amount: number;
  from: string;
  to: string;
  message?: string;

  constructor(amount: number, from: string, to: string, message?: string) {
    this.amount = amount;
    this.from = from;
    this.to = to;
    this.message = message;
  }
}
