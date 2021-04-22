import { Transaction } from "../Transaction/transaction_class";

export class Block {
  index: number;
  prevHash: string;
  currHash: string;
  transactions: Transaction[];
  timestamp = Date.now();

  constructor(index: number, prevHash: string, currHash: string, transactions: Transaction[]) {
    this.index = index;
    this.prevHash = prevHash;
    this.currHash = currHash;
    this.transactions = transactions;
  }
}