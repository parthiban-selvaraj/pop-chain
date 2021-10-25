const { tSEnumDeclaration } = require('@babel/types');
const { MINING_REWARD } = require('../config');
const { blockchainWallet } = require('./index');
const Wallet = require('./index');
const Transaction = require('./transaction');

describe('Test Transaction capabilities', () => {
    let transaction, wallet, receiver, amount;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        receiver = 'dummy receiver';
        transaction = Transaction.newTransaction(wallet, receiver, amount);
    });

    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount);
    });

    it('outputs the `amount` added to receiver', () => {
        expect(transaction.outputs.find(output => output.address === receiver).amount)
            .toEqual(amount);
    });

    it('outputs error message if given amount exceeds the wallet balance', () => {
        amount = 5000;
        expect(Transaction.newTransaction(wallet, receiver, amount)).toEqual(undefined);
    });

    it('inputs the balance of wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction against its signature', () => {
        expect(Transaction.verifyTransacion(transaction)).toBe(true);
    });

    it('invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransacion(transaction)).toBe(false);
    });

    describe('additional test suite for update function in Transaction', () => {
        let nextAmount, nextReceiver;

        beforeEach(() => {
            nextAmount = 20;
            nextReceiver = 'n3xt-4ddr355';
            transaction = transaction.update(wallet, nextReceiver, nextAmount);
        });

        it('subtracts the next amount from sender\'s output', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next receiver', () => {
            expect(transaction.outputs.find(output => output.address === nextReceiver).amount)
                .toEqual(nextAmount);
        });
    });

    describe('creating a reward transaction', () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
        });

        it('reward miner\'s wallet', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(MINING_REWARD);
        });
    });
});