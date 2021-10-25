const Websocket = require('ws');
// for main websocket server where other peers connects to
const P2P_PORT = process.env.P2P_PORT || 5001;

// array of peer's endpoint
// $ HTTP_PORT=4001 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
// based on above example 3 peers are connecting from 5001, 2 and 3
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
// message types included to differenciate sockets are handling chain(block) or transaction pool
const MESSAGE_TYPES = {
    chain : 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions : 'CLEAR_TRANSACTION'
};

class P2pServer {
    // each p2p server will get blockchain object so that they can start their blockchain
    // submitted transaction will be broadcasted through transaction pool by invoking socket
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    listen() {
        const server = new Websocket.Server({ port : P2P_PORT });
        // event listener listen to connection event on server 
        server.on('connection', socket => this.connectionSocket(socket));
        
        // once socket details are accquired below function will connect to each of them
        this.connectToPeers();
        
        console.log(`Listening for peer-to-peer connections on : ${P2P_PORT}`);
    }

    connectToPeers() {
        peers.forEach( peer => {
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectionSocket(socket));
        });

    }

    connectionSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected');
        // each socket can communicate together
        // we use that communication to transfer blockchain data. so that they can update
        this.messageHandler(socket);

        this.sendChain(socket);
    }

    messageHandler(socket) {
        // in any socket if there is message event then we parse that message and print it
        socket.on('message', message => {
            const data = JSON.parse(message);
            // checks incoming socket message is chain(block) or transaction pool
            switch(data.type) {
                case MESSAGE_TYPES.chain:
                    // check whether given chain is valid and longest
                    this.blockchain.replaceChain(data.chain);
                    break;

                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;

                case MESSAGE_TYPES.clear_transactions:
                    this.transactionPool.clear();
                    break;
            }

            // console.log('data', data);
        });
    }

    sendChain(socket) {
        // below method triggers the communication among sockets
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        }));
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            transaction
        }));
    }
    
    // broadcasting block data to all the peers through their socket
    syncChains() {
        console.log('sync chain activated')
        this.sockets.forEach( socket => this.sendChain(socket));
    }

    // broadcast transaction to all the peers thus making transaction pool as common
    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }

    // broadcast clear transaction to all peers
    broadcastClearTransactions() {
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPES.clear_transactions
        })));
    }
}

module.exports = P2pServer;

