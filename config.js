// PoW hashing difficulty
const DIFFICULTY = 3;
// mine rate in miliseconds time value used to determine the hash difficulty dynamically.
// in ideal case, every 3 seconds expecting a block 
const MINE_RATE = 3000;

// setting up global initial baqlance for all the accounts to initiate the transactions
const INITIAL_BALANCE = 500;

const MINING_REWARD = 50;

// ES6 convention to export an object
module.exports = { DIFFICULTY, MINE_RATE, INITIAL_BALANCE, MINING_REWARD };