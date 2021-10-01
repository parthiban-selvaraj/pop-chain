const Websocket = require('ws');
// for main websocket server where other peers connects to
const P2P_PORT = process.env.P2P_PORT || 5001;

// array of peer's endpoint
// $ HTTP_PORT=4001 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
// based on above example 3 peers are connecting from 5001, 2 and 3
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
    // each p2p server will get blockchain object so that they can start their blockchain
    constructor(blockchain) {
        this.blockchain = blockchain;
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
            // console.log('data', data);
            
            // check whether given chain is valid and longest
            this.blockchain.replaceChain(data);
        });
    }

    sendChain(socket) {
        // below method triggers the communication among sockets
        socket.send(JSON.stringify(this.blockchain.chain));
    }
    
    // broadcasting block data to all the peers through their socket
    syncChains() {
        console.log('sync chain activated')
        this.sockets.forEach( socket => this.sendChain(socket));
    }
}

module.exports = P2pServer;

