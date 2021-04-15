import { Chain } from "./chain";
import { Transaction } from "./transaction";

export class Wallet {
  publicKey: CryptoKey;
  privateKey: CryptoKey;

  constructor() {
    this.publicKey = { type: "public", extractable: true, algorithm: { name: "ECDSA" }, usages: ["verify"] };
    this.privateKey = { type: "private", extractable: true, algorithm: { name: "ECDSA" }, usages: ["sign"] };
  }

  async initialize(): Promise<void> {
    const keyPair = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]); // prettier-ignore
    this.publicKey = keyPair.publicKey;
    this.privateKey = keyPair.privateKey;
  }

  getMessageEncoding(message: string): Uint8Array {
    return new TextEncoder().encode(message);
  }

  async sendMoney(amount: number, to: CryptoKey, message?: string): Promise<void> {
    const transaction = new Transaction(amount, this.publicKey, to, message);
    const data = Chain.stringToArrayBuffer(JSON.stringify(transaction));
    const signature = await window.crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, this.privateKey, data);

    await Chain.instance.verifyTransaction(transaction, signature);
  }
}
