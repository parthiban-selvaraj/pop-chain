const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');
const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');

describe('testing wallet functionalities', () => {
    let wallet, tPool, bc;

    beforeEach(() => {
        wallet = new Wallet();
        tPool = new TransactionPool();
        bc = new Blockchain();
    });

    describe('creating transaction', () => {
        let transaction, sendAmount, receiver;

        beforeEach(() => {
            sendAmount = 50;
            receiver = 'r4nd0m-4ddr355';
            transaction = wallet.createTransaction(receiver, sendAmount, bc, tPool);
        });

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(receiver, sendAmount, bc, tPool);
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
                expect(wallet.createTransaction(receiver, sendAmount, bc, tPool))
                    .toEqual(undefined);
            });
        });
    });

    describe('calculating user balance', () => {
        let addBalance, repeatTimes, sender;

        beforeEach(() => {
            sender = new Wallet();
            addBalance = 200;
            repeatTimes = 2;
            for (let i = 0; i < repeatTimes; i++) {
                sender.createTransaction(wallet.publicKey, addBalance, bc, tPool);
            }
            bc.addBlock(tPool.transactions);
        });

        it('calculates balance of receiver wallet from blockchain transactions', () => {
            // console.log('receiver:', wallet.calculateUserBalance(bc))
            expect(wallet.calculateUserBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatTimes));
        });

        it('calculates balance of sender wallet from blockchain transactions', () => {
            // console.log('sender:', sender.calculateUserBalance(bc))
            expect(sender.calculateUserBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatTimes));
        });

        describe('and receiver conducts a transaction', () => {
            let subtractBalance, receiverBalance;

            beforeEach(() => {
                tPool.clear();
                subtractBalance = 27;
                receiverBalance = wallet.calculateUserBalance(bc);
                wallet.createTransaction(sender.publicKey, subtractBalance, bc, tPool);
                bc.addBlock(tPool.transactions);
            });

            describe('and sender sends another transaction to the receiver', () => {
                beforeEach(() => {
                    tPool.clear();
                    addBalance = 100;
                    sender.createTransaction(wallet.publicKey, addBalance, bc, tPool);
                    bc.addBlock(tPool.transactions);
                    // console.log('receiver', wallet.calculateUserBalance(bc));
                    // console.log('sender', sender.calculateUserBalance(bc));
                });

                it('calculates the receiver balance only using recent transactions not from history', () => {
                    // console.log('receiver', wallet.calculateUserBalance(bc), addBalance);
                    expect(wallet.calculateUserBalance(bc)).toEqual(receiverBalance - subtractBalance + addBalance);
                });

                // add test for sender
            });
        });
    });
});