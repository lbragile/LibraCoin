import { Chain } from "../../chain";
import { Transaction } from "../../transaction";

export class Wallet {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  balance: number;

  constructor() {
    this.publicKey = { type: "public", extractable: true, algorithm: { name: "ECDSA" }, usages: ["verify"] };
    this.privateKey = { type: "private", extractable: true, algorithm: { name: "ECDSA" }, usages: ["sign"] };
    this.balance = 1000;
  }

  async initialize(): Promise<void> {
    const keyPair = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]); // prettier-ignore
    this.publicKey = keyPair.publicKey;
    this.privateKey = keyPair.privateKey;
  }

  static async CryptoKeyToHex(format: string, key: CryptoKey): Promise<string> {
    const buf = (await window.crypto.subtle.exportKey(format, key)) as ArrayBuffer;
    return Chain.bufferToHex(buf);
  }

  getMessageEncoding(message: string): Uint8Array {
    return new TextEncoder().encode(message);
  }

  async sendMoney(amount: number, to: CryptoKey, message?: string): Promise<void> {
    if (amount <= this.balance) {
      const transaction = new Transaction(amount, this.publicKey, to, message);
      const data = Chain.stringToArrayBuffer(JSON.stringify(transaction));
      const signature = await window.crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, this.privateKey, data);

      const isValid = await Chain.instance.verifyTransaction(transaction, signature);

      if (isValid) {
        this.balance -= amount;
      } else {
        alert("Invalid transaction!");
      }
    } else {
      alert("Your balance is not high enough to cover this transaction.");
    }
  }
}
