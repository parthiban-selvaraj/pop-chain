<h1> Creating my own Blockchain </h1>
<p> block.js contains classes to create genesis bloc, mining and display block</p>
<p> using POSTMAN tested P2P communication and Block Sync</p>
<p> PoW consensus algoritham added</p>
<p> Dynamically added difficulty adjustments for given MINE_RATE of 3 secs</p>
<p> Added wallets and Key pair generation feature for transactions </P>
<p> Added transaction object with basic validations </p>
<p> Added sign and verify transaction features </p>
<p> Can user update a transaction and add or update it in trnsaction pool </p>
<p> Added API endpoints for POST and GET transactions with braodcast feature </p>
<p> Added Mine endpoint and enablabed Block Mining and rewarding </p>
<p> Added wallet balance calculation and endpoint for the same </p>
<ol> Next Steps
    <li> GET request for getting wallet balance '/balance' </li>
    <li> Add transaction fee for each user and include collective fees to miner </li>
    <li> Build userinterfaces </li>
    <li> add confirmed and unconfirmed status to transactions and create sub set in txn pool </li>
    <li> create dedicated server for reward transactions for security reasons </li>
</ol>