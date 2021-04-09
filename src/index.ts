import { Wallet } from "./wallet";
import { Chain } from "./chain";

const lior = new Wallet();
const bamba = new Wallet();
const anon = new Wallet();

// first 2 transactions
lior.sendMoney(1e3, bamba.publicKey, "Good dog gets money");
anon.sendMoney(1e6, bamba.publicKey, "Be rich Bamba");

// next 2 transactions
anon.sendMoney(10, lior.publicKey, "You deserve this much");
lior.sendMoney(1, anon.publicKey, "Thank you");

// last transaction
bamba.sendMoney(1, lior.publicKey, "I am rich 😀🐶");
lior.sendMoney(1, bamba.publicKey);

console.log(Chain.instance.blockChain);
