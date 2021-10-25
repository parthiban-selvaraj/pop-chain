const Transaction = require('./transaction');
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
    
    // this function will validate each transaction input amount that is matching it to output amount
    // validates each transactions signature as well 
    validTransactions() {
        return this.transactions.filter(transaction => {
            // combine all the output for each transaction and check with input amount
            const outputTotal = transaction.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0);

            // reject this transaction if total output amount didn't match with input
            if (transaction.input.amount !== outputTotal) {
                console.log(`Invalid transaction from ${transaction.input.address}`);
                return;
            }

            // reject this transaction if signature is not valid
            if (!Transaction.verifyTransacion(transaction)) {
                console.log(`Invalid signature from ${transaction.input.address}`);
                return;
            }

            return transaction;        
        });
    }
    
    // this will clear all confirmed and valid transactions from pool 
    clear() {
        this.transactions = [];
    }
}

module.exports = TransactionPool;