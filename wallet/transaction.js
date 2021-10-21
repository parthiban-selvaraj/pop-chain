const ChainUtil = require('../chain-util');

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(sender, receiver, amount) {
        const senderOutput = this.outputs.find(output => output.address === sender.publicKey);

        // transaction amount should not be greater than sender wallet balance
        if (amount > senderOutput.amount) {
            console.log(`Amount : ${amount} exceeds balance`);
            return `Amount: ${amount} exceeds the balance`;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount, address: receiver});
        Transaction.signTransaction(this, sender);

        return this;
    }

    static newTransaction(sender, receiver, amount) {
        // initialize transaction object by calling contructor
        const transaction = new this();
        
        if (amount > sender.balance) {
            console.log(`Amount : ${amount} exceeds balance`);
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