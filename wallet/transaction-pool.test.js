const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const { isTaggedTemplateExpression, exportAllDeclaration } = require('@babel/types');

describe('Testing Transaction Pool functionalities', () => {
    let tPool, wallet, transaction;

    beforeEach(() => {
        tPool = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, 'r4nd-4dr355', 30);
        tPool.updateOrAddTransaction(transaction);
    });

    it('adds transaction to transaction pool', () => {
        expect(tPool.transactions.find(txn => txn.id === transaction.id)).toEqual(transaction);
    });

    it('updates the existing transaction in transaction pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'test-4ddr355', 40);
        tPool.updateOrAddTransaction(newTransaction);
        console.log(oldTransaction);
        console.log(JSON.stringify(tPool.transactions.find(txn => txn.id === newTransaction.id)));
        expect(JSON.stringify(tPool.transactions.find(txn => txn.id === newTransaction.id)))
            .not.toEqual(oldTransaction);
    });
});