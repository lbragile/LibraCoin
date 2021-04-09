import { Transaction } from "./transaction";

export class Block {
  prevHash: string;
  currHash: string;
  transactions: Transaction[];
  timestamp = Date.now();

  constructor(prevHash: string, currHash: string, transactions: Transaction[]) {
    this.prevHash = prevHash;
    this.currHash = currHash;
    this.transactions = transactions;
  }
}
