// Jest testing file for block.js

const { exportAllDeclaration } = require('@babel/types');
const Block = require('./block');

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
});