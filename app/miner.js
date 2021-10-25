const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    // function which will do follwing things
    //  pull verified transactions from pool
    //  add these transactions to block
    // braodcast transactions to other miners as well via p2pserver
    mine() {
        const validTransactions = this.transactionPool.validTransactions();
        // include reward for the miner at the end of block
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
        
        // create a block consisting of valid transactions
        const block = this.blockchain.addBlock(validTransactions);
        
        // sync the chains in p2p server
        this.p2pServer.syncChains();

        // clear valid and confirmed transactions from pool and broadcast same to other miners via p2p
        this.transactionPool.clear();
        this.p2pServer.broadcastClearTransactions();

        return block;
    }
}

module.exports = Miner;