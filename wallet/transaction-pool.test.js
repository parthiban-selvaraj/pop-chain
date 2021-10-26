const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const { isTaggedTemplateExpression, exportAllDeclaration } = require('@babel/types');
const Blockchain = require('../blockchain');

describe('Testing Transaction Pool functionalities', () => {
    let tPool, wallet, transaction, bc;

    beforeEach(() => {
        tPool = new TransactionPool();
        wallet = new Wallet();
        bc = new Blockchain();
        // transaction = Transaction.newTransaction(wallet, 'r4nd-4dr355', 30);
        // tPool.updateOrAddTransaction(transaction);
        transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tPool);
    });

    it('adds transaction to transaction pool', () => {
        expect(tPool.transactions.find(txn => txn.id === transaction.id)).toEqual(transaction);
    });

    it('updates the existing transaction in transaction pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'test-4ddr355', 40);
        tPool.updateOrAddTransaction(newTransaction);
        
        expect(JSON.stringify(tPool.transactions.find(txn => txn.id === newTransaction.id)))
            .not.toEqual(oldTransaction);
    });

    it('clears valid and confirmed transactions from transaction pool', () => {
        tPool.clear();
        expect(tPool.transactions.length).toEqual(0);
    });

    describe('mixing valid and corrupt transactions', () => {
        let validTransactions;

        beforeEach(() => {
            // spread operator which is spreading incoming values as array elements
            validTransactions = [...tPool.transactions];
            // alternate transactions will have corrupted values
            for (let i=0; i < 6; i++ ) {
                wallet = new Wallet();
                transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tPool);

                if (i%2 == 0) {
                    // corrupting even numbered transaction with huge input amount 
                    transaction.input.amount = 99999;
                } else {
                    validTransactions.push(transaction);
                }
            }
        });

        it('shows a difference between valid and corrupt transactions', () => {
            expect(JSON.stringify(tPool.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs only valid transactions', () => {
            expect(tPool.validTransactions()).toEqual(validTransactions)
        });
    });
});