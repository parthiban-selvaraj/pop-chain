const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');

//  either use value of HTTP_PORT cmd variable from cmd or default one 40001
//  e.g $ HTTP_PORT=8001 npm run dev
const HTTP_PORT = process.env.HTTP_PORT || 4001;

const app = express();
const bc = new Blockchain();

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
    res.json(bc.chain);
});

// endpoint for mining a block and adding to chain
app.post('/mineBlock', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added ${block.toString()}`);

    res.redirect('/blocks');
})

app.listen(HTTP_PORT, () => {
    console.log(`App running on port ${HTTP_PORT}`);
});

