const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        // get last block data from Blockchain attribute this.chain -> this.chain[this.chain.length-1]
        const block = Block.mineBlock(this.chain[this.chain.length-1], data);
        this.chain.push(block);

        return block;
    }

    // to check the integrity of each block.
    isValidChain(chain) {
        // check for genesis block
        // console.log(JSON.stringify(chain[0]));
        // console.log(Block.genesis());
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        // check integrity of current block to previous block
        for(let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i-1];

            if (block.lastHash !== lastBlock.hash || 
                block.hash !== Block.blockHash(block)) {
                return false;
            }
        }

        return true;
    }

    // below method replaces if chain is found to be corrupted or no longer chain
    replaceChain(newChain) {
        // console.log(this.chain.length);
        // console.log(newChain.length);
        if(newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than current chain');
            return; // empty return
        } else if (!this.isValidChain(newChain)) {
            console.log('The received chain is not valid or corrupted');
            return;
        }

        console.log('Replacing blockchain with new chain');
        this.chain = newChain;
    }
}

module.exports = Blockchain;