// Jest testing file for block.js

const { exportAllDeclaration } = require('@babel/types');
const Block = require('./block');
// const { DIFFICULTY } = require('../config')

describe('testing for block.js', () => {
    let data, lastBlock, block;
    beforeEach(() => {
        data = 'this the data which goes to bew block';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('sets `data` to match the input', () => {
        expect(block.data).toEqual(data);
    });

    it('check `lastHash` matches to hash of last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('check whether generated hash from mine block func matches the difficuly', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
        
    });

    it('lowers the difficulty for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+36000)).toEqual(block.difficulty-1);
        console.log(block.toString());
    });

    it('raises the difficulty for quickly mined blockcs', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+1)).toEqual(block.difficulty+1);
        console.log(block.toString());
    });
});