"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
class Transaction {
    constructor(amount, from, to, message) {
        this.amount = amount;
        this.from = from;
        this.to = to;
        this.message = message;
    }
}
exports.Transaction = Transaction;
