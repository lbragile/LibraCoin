import * as crypto from "crypto";
import { Block } from "./block";
import { Transaction } from "./transaction";

export class Chain {
  static instance = new Chain();

  #chain: Block[];
  #verifiedTransactions: Transaction[];
  #BLOCK_LIMIT = 2;

  constructor() {
    const genesisTransaction = [new Transaction(100, "lior", "bamba")];
    const genesisPrevHash = Array(64).fill("0").join("");
    const genesisCurrHash = crypto.createHash("SHA256").digest("hex");
    this.#chain = [new Block(genesisPrevHash, genesisCurrHash, genesisTransaction)];
    this.#verifiedTransactions = [];
  }

  get blockChain(): Block[] {
    return this.#chain;
  }

  get lastBlock(): Block {
    return this.#chain[this.#chain.length - 1];
  }

  mine(nonce: number, leadingZeros: number): string {
    console.log("⚒ mining...");

    let counter = 0;
    let candidateSolution = "";
    while (counter <= Number.MAX_SAFE_INTEGER) {
      const hash = crypto.createHash("SHA256");
      hash.update((nonce + counter).toString()).end();
      candidateSolution = hash.digest("hex");

      const leadingBits = candidateSolution.substr(0, leadingZeros).split("");
      if (leadingBits.every((bit) => bit === "0")) {
        console.log(`Solved: ${counter}`);
        break;
      }

      counter += 1;
    }

    return candidateSolution;
  }

  verifyTransaction(transaction: Transaction, signature: Buffer): void {
    const verify = crypto.createVerify("SHA256");
    verify.update(JSON.stringify(transaction));

    if (verify.verify(transaction.from, signature)) {
      this.#verifiedTransactions.push(transaction);
      console.log("✅ Verified Transaction!");
      console.log(`Transaction Pool Now Has ${this.#verifiedTransactions.length} Verified Transactions`);
    }

    if (this.#verifiedTransactions.length === this.#BLOCK_LIMIT) {
      this.addBlock(this.#verifiedTransactions);
      this.#verifiedTransactions = []; // empty the verified transaction pool
    }
  }

  addBlock(transactions: Transaction[]): void {
    // new hash needs between 2 and 3 leading zeros
    const numZeros = Math.round(Math.random() * 2) + 2;
    const targetHash = crypto.createHash("SHA256");
    targetHash.update(crypto.randomBytes(20).toString("hex")).end();

    // replace leading bits with zeros
    const re = new RegExp(`^.{0,${numZeros}}`, "g");
    const zerosStr = Array(numZeros).fill("0").join("");
    const targetStr = targetHash.digest("hex").replace(re, zerosStr);

    // only add a block of transactions to the chain if it was mined successfully and the new hash is <= target
    let acceptableHashFound = false;
    while (!acceptableHashFound) {
      const nonce = Math.round(Math.random() * 999999999);
      const newHash = this.mine(nonce, numZeros);

      if (newHash <= targetStr) {
        const newBlock = new Block(this.lastBlock.currHash, newHash, transactions);
        this.#chain.push(newBlock);
        console.log("✨ Added Block To Chain");
        acceptableHashFound = true;
      } else {
        console.log("❌ Failed Mining Below Target");
      }
    }
  }
}
