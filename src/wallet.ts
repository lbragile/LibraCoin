import * as crypto from "crypto";
import { Transaction } from "./transaction";

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
    // console.log(this.publicKey, this.#privateKey);
  }

  sendMoney(amount: number, to: string): void {
    const transaction = new Transaction(amount, this.publicKey, to);

    const sign = crypto.createSign("SHA256");
    sign.update(JSON.stringify(transaction)).end();
    const signature = sign.sign(this.#privateKey, "hex"); // 512 character hex signature
    // console.log(signature);
  }
}
