// const Block = require('./blockchain/block');

// console.log(Block.genesis().toString());

// const geneBlock = Block.mineBlock(Block.genesis(), 'string in genesis block')

// console.log(geneBlock.toString())

// const block = new Block(Date.now(), geneBlock.hash, Block.hash(Date.now(), geneBlock.hash, 'my data is junk'), 'my data is junk');

// console.log(block.toString());

// Test for display difficulty and Hash value
// const Blockchain = require('./blockchain');

// const bc = new Blockchain();

// for (let i = 0; i < 10; i++) {
//     console.log(bc.addBlock(`Block No: ${i}`).toString());
// };

// test for displaying wallet
const Wallet = require('./wallet');
const wallet = new Wallet();

console.log(wallet.toString());