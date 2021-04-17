import { Block } from "./components/Block/block_class";
import { Transaction } from "./components/Transaction/transaction_class";
import { Wallet } from "./components/Wallet/Wallet_class";

export class Chain {
  #chain: Block[];
  #verifiedTransactions: Transaction[];
  #BLOCK_LIMIT = 2;
  #users: Wallet[];

  static instance = new Chain();

  static stringToArrayBuffer(str: string): ArrayBuffer {
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  static bufferToHex(hashBuffer: ArrayBuffer): string {
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
    return hashHex;
  }

  constructor() {
    const genericCryptoKey = {
      type: "public",
      extractable: true,
      algorithm: { name: "ECDSA" },
      usages: ["verify"],
    } as CryptoKey;

    const genesisTransaction = [new Transaction(0, genericCryptoKey, genericCryptoKey)];
    const genesisPrevHash = Array(64).fill("0").join("");
    const genesisCurrHash = this.randomHash(32).replace(/^.{0,3}/, "000");
    this.#chain = [new Block(0, genesisPrevHash, genesisCurrHash, genesisTransaction)];
    this.#verifiedTransactions = [];
    this.#users = [];
  }

  get blockChain(): Block[] {
    return this.#chain;
  }

  get lastBlock(): Block {
    return this.#chain[this.#chain.length - 1];
  }

  addUser(user: Wallet): void {
    this.#users.push(user);
  }

  randomHash(len: number): string {
    return Chain.bufferToHex(window.crypto.getRandomValues(new Uint32Array(len)));
  }

  async digestMessage(message: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    return Chain.bufferToHex(hashBuffer);
  }

  async mine(nonce: number, leadingZeros: number): Promise<string> {
    console.log("⚒ mining...");

    let candidateSolution = "";
    while (nonce <= Number.MAX_SAFE_INTEGER) {
      candidateSolution = await this.digestMessage(nonce.toString());

      const leadingBits = candidateSolution.substr(0, leadingZeros).split("");
      if (leadingBits.every((bit) => bit === "0")) {
        console.log(`Solved: ${nonce}`);
        break;
      }

      nonce++;
    }

    return candidateSolution;
  }

  async verifyTransaction(transaction: Transaction, signature: ArrayBuffer): Promise<boolean> {
    const data = Chain.stringToArrayBuffer(JSON.stringify(transaction));
    const isValid = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, transaction.from, signature, data);

    if (isValid) {
      this.#verifiedTransactions.push(transaction);
      console.log("✅ Verified Transaction!");
      console.log(`Transaction Pool Now Has ${this.#verifiedTransactions.length} Verified Transactions`);
    }

    if (this.#verifiedTransactions.length === this.#BLOCK_LIMIT) {
      await this.addBlock(this.#verifiedTransactions);
      this.#verifiedTransactions = []; // empty the verified transaction pool
    }

    return isValid;
  }

  async addBlock(transactions: Transaction[]): Promise<void> {
    // new hash needs between 2 and 3 leading zeros
    const numZeros = Math.round(Math.random() * 2) + 2;
    const targetHash = await this.digestMessage(this.randomHash(20));

    // replace leading bits with zeros
    const re = new RegExp(`^.{0,${numZeros}}`, "g");
    const zerosStr = Array(numZeros).fill("0").join("");
    const targetStr = targetHash.replace(re, zerosStr);

    // only add a block of transactions to the chain if it was mined successfully and the new hash is <= target
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const nonce = Math.round(Math.random() * 999999999);
      const newHash = await this.mine(nonce, numZeros);

      if (newHash <= targetStr) {
        const newBlock = new Block(this.lastBlock.index + 1, this.lastBlock.currHash, newHash, transactions);
        this.#chain.push(newBlock);
        console.log("✨ Added Block To Chain");
        break;
      } else {
        console.log("❌ Failed Mining Below Target");
      }
    }
  }
}
