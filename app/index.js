const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

//  either use value of HTTP_PORT cmd variable from cmd or default one 40001
//  e.g $ HTTP_PORT=8001 npm run dev
const HTTP_PORT = process.env.HTTP_PORT || 4001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tPool = new TransactionPool();
// creating P2P server object and sending above blockchain object
const p2pServer = new P2pServer(bc, tPool);
const miner = new Miner(bc, tPool, wallet, p2pServer);

// app.use(bodyParser.json());
// app.use(express.bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// end point to get all blocks
app.get('/blocks', (req, res) => {
    // add validations and set error code for empty response
    res.json(bc.chain);
});

// endpoint for mining a block and adding to chain
app.post('/mineBlock', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added ${block.toString()}`);

    p2pServer.syncChains();

    res.redirect('/blocks');
});

// creating transaction and braodcasting to all peers
app.post('/transaction', (req, res) => {
    const { receiver, amount } = req.body;

    const transaction = wallet.createTransaction(receiver, amount, tPool);
    // broadcast created transaction to all peers via sockets
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
})

// for getting all the transactions from transaction pool
app.get('/transactions', (req, res) => {
    res.json(tPool.transactions);
});

app.get('/mine-transaction', (req, res) => {
    const block = miner.mine();
    console.log(`New Block added: ${block.toString()}`);
    res.redirect('/blocks');
})
// for retriveing own public key address
app.get('/public-key', (req, res) => {
    res.json({ publicKey : wallet.publicKey });
})

app.listen(HTTP_PORT, () => {
    console.log(`App running on port ${HTTP_PORT}`);
});

p2pServer.listen();

// command for connecting another peer
// HTTP_PORT=4002 P2P_PORT=5002 PEERS=ws://localhost:5001