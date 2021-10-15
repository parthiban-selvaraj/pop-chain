const EC = require('elliptic').ec;
// Hashing algoritham used in Bitcoin
const ec = new EC('secp256k1');
// npm module to generate universal Unique ID for each transaction. 
// prefered to use V1 function which uses timestamp to create UUID
const uuidV1 = require('uuid');


// generates Key Pair (pub + Priv) for each user
class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }

    static id() {
        return uuidV1.v1();
    }
}

module.exports = ChainUtil;