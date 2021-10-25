const { INITIAL_BALANCE } = require('../config');
const Transaction = require('./transaction')
const ChainUtil = require('../chain-util');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
            Public Key  : ${this.publicKey.toString()}
            Balance     : ${this.balance}`
    }

    // for signing each transaction input with private key
    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    // combined function which creates a transaction for given public key/wallet and
    // then captures the transaction update if any from TransactionPool. If yes then update or add to pool 
    createTransaction(receiver, amount, transactionPool) {
        if (amount > this.balance) {
            console.log(`Amount ${amount} exceeds the wallet balance ${this.balance}`);
            return;
        }

        // check txn already exists in pool or not
        let transaction = transactionPool.existingTransaction(this.publicKey);

        if (transaction) {
            transaction.update(this, receiver, amount);
        } else {
            transaction = Transaction.newTransaction(this, receiver, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';

        return blockchainWallet;
    }

}

module.exports = Wallet;