import { Chain } from "./chain.js";
import { Transaction } from "./transaction.js";

export class Wallet {
  publicKey: CryptoKey = {
    type: "public",
    extractable: true,
    algorithm: { name: "ECDSA" },
    usages: ["verify"],
  };
  #privateKey: CryptoKey = {
    type: "private",
    extractable: true,
    algorithm: { name: "ECDSA" },
    usages: ["sign"],
  };

  constructor() {
    // intentionally blank
  }

  async initialize(): Promise<void> {
    const keyPair = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]); // prettier-ignore
    this.publicKey = keyPair.publicKey;
    this.#privateKey = keyPair.privateKey;
  }

  getMessageEncoding(message: string): Uint8Array {
    return new TextEncoder().encode(message);
  }

  async sendMoney(amount: number, to: CryptoKey, message?: string): Promise<void> {
    const transaction = new Transaction(amount, this.publicKey, to, message);
    const data = Chain.stringToArrayBuffer(JSON.stringify(transaction));
    const signature = await window.crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, this.#privateKey, data);

    await Chain.instance.verifyTransaction(transaction, signature);
  }
}

// this.publicKey = Chain.bufferToHex(await window.crypto.subtle.exportKey("spki", keyPair.publicKey));
// this.#privateKey = Chain.bufferToHex(await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey));
