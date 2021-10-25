const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

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
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount, address: receiver});
        Transaction.signTransaction(this, sender);

        return this;
    }

    static transactionWithOutputs(sender, outputs) {
        // initialize transaction object by calling contructor
        const transaction = new this();

        // spread operation - pushes elements one by one
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, sender);
        return transaction;
    }

    static newTransaction(sender, receiver, amount) {
        if (amount > sender.balance) {
            console.log(`Amount : ${amount} exceeds balance`);
            return;
        }

        return Transaction.transactionWithOutputs(sender, [
            { amount : sender.balance - amount, address : sender.publicKey },
            { amount, address: receiver }
        ]);
    }

    // minning reward which will be initiated from special wallet assigned to blockchain system
    // this reward transaction will not have multiple output objects (i.e deduction result object in output)
    static rewardTransaction(miner, blockchainWallet) {
        return Transaction.transactionWithOutputs(blockchainWallet, [{
            amount : MINING_REWARD, address : miner.publicKey
        }]);
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