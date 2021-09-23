const Block = require('./block');

console.log(Block.genesis().toString());

const geneBlock = Block.mineBlock(Block.genesis(), 'string in genesis block')

console.log(geneBlock.toString())

const block = new Block(Date.now(), geneBlock.hash, Block.hash(Date.now(), geneBlock.hash, 'my data is junk'), 'my data is junk');

console.log(block.toString());

