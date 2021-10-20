const { INITIAL_BALANCE } = require('../config');
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

}

module.exports = Wallet;