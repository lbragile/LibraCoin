import { Block } from "../Block/block_class";
import { Transaction } from "../Transaction/transaction_class";
import { Wallet } from "../Wallet/Wallet_class";

export class Chain {
  #chain: Block[];
  #verifiedTransactions: Transaction[];
  #BLOCK_LIMIT = 2;
  #users: Wallet[];

  static instance = new Chain(JSON.parse(localStorage.getItem("chain") as string));

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

  constructor(chain: Block[] | undefined) {
    const genericCryptoKey = {
      type: "public",
      extractable: true,
      algorithm: { name: "ECDSA" },
      usages: ["verify"],
    } as CryptoKey;

    const genesisTransaction = [new Transaction(0, genericCryptoKey, genericCryptoKey)];
    const genesisCurrHash = Array(64).fill("0").join("");
    this.#chain = chain ?? [new Block(0, "", genesisCurrHash, genesisTransaction)];
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

  async mine(
    nonce: number,
    leadingZeros: number,
    setNonce: (arg: number) => void,
    setSolution: (arg: string) => void
  ): Promise<string> {
    console.log("⚒ mining...");

    let candidateSolution = "";
    while (nonce <= Number.MAX_SAFE_INTEGER) {
      candidateSolution = await this.digestMessage(nonce.toString());
      setSolution(candidateSolution);

      const leadingBits = candidateSolution.substr(0, leadingZeros).split("");
      if (leadingBits.every((bit) => bit === "0")) {
        console.log(`Solved: ${nonce}`);
        break;
      }

      setNonce(nonce++);
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
      this.addBlock("", this.#verifiedTransactions);
      this.#verifiedTransactions = []; // empty the verified transaction pool
    }

    return isValid;
  }

  addBlock(newHash: string, transactions: Transaction[]): void {
    const newBlock = new Block(this.lastBlock.index + 1, this.lastBlock.currHash, newHash, transactions);
    this.#chain.push(newBlock);
    localStorage.setItem("chain", JSON.stringify(this.blockChain));
  }
}
