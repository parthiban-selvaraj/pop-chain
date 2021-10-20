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

        Transaction.signTransaction(transaction, sender);

        return transaction;
    }

    static signTransaction(transaction, sender) {
        transaction.input = {
            timestamp : Date.now(),
            amount : sender.balance,
            address : sender.publicKey,
            signature : sender.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    // for verify each transaction's signature with public key
    static verifyTransacion(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address, 
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }
}

module.exports = Transaction;