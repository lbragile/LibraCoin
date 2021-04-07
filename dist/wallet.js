"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const crypto = __importStar(require("crypto"));
const transaction_1 = require("./transaction");
class Wallet {
    constructor() {
        const keyPair = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: { type: "spki", format: "pem" },
            privateKeyEncoding: { type: "pkcs8", format: "pem" },
        });
        this.#privateKey = keyPair.privateKey;
        this.publicKey = keyPair.publicKey;
        console.log(this.publicKey, this.#privateKey);
    }
    #privateKey;
    sendMoney(amount, to) {
        const transaction = new transaction_1.Transaction(amount, this.publicKey, to);
        const sign = crypto.createSign("SHA256");
        sign.update(JSON.stringify(transaction)).end();
        const signature = sign.sign(this.#privateKey, "hex"); // 512 character hex signature
        console.log(signature);
    }
}
exports.Wallet = Wallet;
