const EC = require('elliptic').ec;
// Hashing algoritham used in Bitcoin
const ec = new EC('secp256k1');

// generates Key Pair (pub + Priv) for each user
class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }
}

module.exports = ChainUtil;