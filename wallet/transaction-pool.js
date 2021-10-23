class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    // below function to add txn to txn pool. If exist already replace it with incoming txn
    updateOrAddTransaction(transaction) {
        let transactionWithId = this.transactions.find(txn => txn.id === transaction.id);

        // if exist then update or add it to pool
        if(transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    // return if transaction already exists  
    existingTransaction(address) {
        return this.transactions.find(txn => txn.input.address === address);
    }
}

module.exports = TransactionPool;