const { isTaggedTemplateExpression } = require('@babel/types');
const Blockchain = require('./index');
const Block = require('./block')

describe('testing Blockchain.js', () => {
    // object created for Blockchain class
    let bc;
    beforeEach(() => {
        bc = new Blockchain();
        // another chain to test the integrity of chain/fork created
        bc2 = new Blockchain();
    });

    it('starts with genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('add new block and check data matches', () => {
        const data = 'new block';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });

    it('validates a valid chain', () => {
        const data = 'parallel chain';
        bc2.addBlock(data);
        // console.log(Block.genesis().toString())
        // console.log(bc2.chain[0].toString())

        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('invalidates genesis block with tempared data', () => {
        bc2.chain[0].data = 'Tampered Genesis Block';

        expect(bc.isValidChain(bc2.chain[0])).toBe(false);
    });

    it('invalidates a corrupt chain', () => {
        bc2.addBlock('parallel chain');
        // corrupt first block data
        bc2.chain[1].data = 'corrupted';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('replaces the chain with longer and valid chain', () => {
        bc2.addBlock('adding one more block');
        // comparing with bc chain with bc2 chain. bc2 has one more block extra. so it is considered as a longest chain
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);

    });

    it('does not replace the chain with chain which has lesser or equal blocks', () => {
        bc.addBlock('adding one more block');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    });
})