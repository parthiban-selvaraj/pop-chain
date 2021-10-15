const ChainUtil = require('../chain-util');

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    static newTransaction(sender, receiver, amount) {
        // initialize transaction object by calling contructor
        const transaction = new this();
        
        if (amount > sender.balance) {
            return `Amount : ${amount} exceeds balance`;
        }
        // spread operation - pushes elements one by one
        transaction.outputs.push(...[
            { amount : sender.balance - amount, address : sender.publicKey },
            { amount, address: receiver }
        ]);

        return transaction;
    }
}

module.exports = Transaction;