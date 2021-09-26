const { isTaggedTemplateExpression } = require('@babel/types');
const Blockchain = require('./blockchain');
const Block = require('./block')

describe('testing Blockchain.js', () => {
    // object created for Blockchain class
    let bc;
    beforeEach(() => {
        bc = new Blockchain();
    });

    it('starts with genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('add new block and check data matches', () => {
        const data = 'new block';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    })
})