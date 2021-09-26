const SHA256 = require('crypto-js/sha256');
class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp  = timestamp;
        this.lastHash   = lastHash;
        this.hash       = hash;
        this.data       = data;
    }

    toString(){
        // template literal used to replace variables quickly
        return `Block -
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0,10)}
        Hash      : ${this.hash.substring(0,10)}
        Data      : ${this.data}`;        
    }
    static genesis() {
        // changing this to static test. this will fail due non-deterministic time value
        // const hash = SHA256(Date.now());
        const hash = SHA256('Satoshi Nakamoto');
        return new this('Genesis Time', '---------', hash.toString(), []);
    }

    static mineBlock(lastBlock, data) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp, lastHash, data);

        return new this(timestamp, lastHash, hash, data);
    }

    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, data} = block;
        return Block.hash(timestamp, lastHash, data);
    }
}

module.exports = Block;