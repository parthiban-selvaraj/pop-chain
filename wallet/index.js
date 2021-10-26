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
    createTransaction(receiver, amount, blockchain, transactionPool) {
        
        // obtain userWallet balance
        this.balance = this.calculateUserBalance(blockchain);
        
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

    calculateUserBalance(blockchain) {
        let balance = this.balance;
        let transactions = [];

        // loop through each blockchain and get tranactions from each block
        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction);
        }));

        // after fetching transactions then filter transactions which are intiated by this wallet
        const walletInputTxns = transactions.filter(transaction => transaction.input.address === this.publicKey);

        let startTime = 0;
        // reduce the above filter result to most recent transaction (based on timestamp) of this wallet
        if (walletInputTxns.length > 0) {
            const recentInputTxn = walletInputTxns.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
            );

            // once recent txn is fetched the find out the output amount from 
            // output object and assign it to balance
            balance = recentInputTxn.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentInputTxn.input.timestamp;
        }

        // apart from recent txn balance what ever txns are coming up (which are not confirmed yet)
        transactions.forEach(transaction => {
            if (transaction.input.timestamp > startTime) {
                transaction.outputs.find(output => {
                    if (output.address === this.publicKey) {
                        balance += output.amount;
                    }
                });
            }
        });
        return balance;
    }

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';

        return blockchainWallet;
    }

}

module.exports = Wallet;