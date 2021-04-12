import * as crypto from "crypto";
import { Chain } from "./chain.js";
import { Transaction } from "./transaction.js";

export class Wallet {
  publicKey: string;
  #privateKey: string;

  constructor() {
    const keyPair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    this.#privateKey = keyPair.privateKey;
    this.publicKey = keyPair.publicKey;
  }

  sendMoney(amount: number, to: string, message?: string): void {
    const transaction = new Transaction(amount, this.publicKey, to, message);

    const sign = crypto.createSign("SHA256");
    sign.update(JSON.stringify(transaction)).end();
    const signature = sign.sign(this.#privateKey);

    Chain.instance.verifyTransaction(transaction, signature);
  }
}
