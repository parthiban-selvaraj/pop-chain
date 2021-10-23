const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');

describe('testing wallet functionalities', () => {
    let wallet, tPool;

    beforeEach(() => {
        wallet = new Wallet();
        tPool = new TransactionPool();
    });

    describe('creating transaction', () => {
        let transaction, sendAmount, receiver;

        beforeEach(() => {
            sendAmount = 50;
            receiver = 'r4nd0m-4ddr355';
            transaction = wallet.createTransaction(receiver, sendAmount, tPool);
        });

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(receiver, sendAmount, tPool);
            });

            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                    .toEqual(wallet.balance - (sendAmount * 2));
            });

            it('clones the `sendAmount` output for the receiver', () => {
                expect(transaction.outputs.filter(output => output.address === receiver)
                    .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            });

            it('return balance exceeds message when amount > balance', () => {
                sendAmount = 501;
                expect(wallet.createTransaction(receiver, sendAmount, tPool))
                    .toEqual(`Amount ${sendAmount} exceeds the wallet balance ${wallet.balance}`);
            });
        });
    });
});