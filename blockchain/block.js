const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');
class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp  = timestamp;
        this.lastHash   = lastHash;
        this.hash       = hash;
        this.data       = data;
        this.nonce      = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString(){
        // template literal used to replace variables quickly
        return `Block -
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0,10)}
        Hash      : ${this.hash.substring(0,10)}
        Data      : ${this.data}        
        Nonce     : ${this.nonce}
        Difficulty: ${this.difficulty}`;
    }
    static genesis() {
        // changing this to static test. this will fail due non-deterministic time value
        // const hash = SHA256(Date.now());
        const hash = ChainUtil.hash('Satoshi Nakamoto');
        return new this('Genesis Time', '---------', hash.toString(), [], 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data) {
        // const timestamp = Date.now();
        let hash, timestamp
        const lastHash = lastBlock.hash;
        

        // PoW algoritham implementation - execute and increment the nonce value until the hash value matches
        // with the difficuly level hashing
        let nonce = 0;
        let { difficulty } = lastBlock;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty); 
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
         

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty} = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;

        // ideally block need to be generated at every 3 sec, if block mined quickly then increase the difficulty 
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty
    }
}

module.exports = Block;