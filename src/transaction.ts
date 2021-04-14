export class Transaction {
  amount: number;
  from: CryptoKey;
  to: CryptoKey;
  message?: string;

  constructor(amount: number, from: CryptoKey, to: CryptoKey, message?: string) {
    this.amount = amount;
    this.from = from;
    this.to = to;
    this.message = message;
  }
}
