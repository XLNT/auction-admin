require("dotenv").config();
const Web3 = require("web3");
const contract = require("truffle-contract");

const HillCoreContract = require("./build/contracts/HillCore.json");

const host = process.env.RPC_HOST || "127.0.0.1";
const port = process.env.RPC_PORT || 7545;
global.web3 = new Web3(
  new Web3.providers.HttpProvider(`http://${host}:${port}`)
);

global.accounts = global.web3.eth.accounts;
global.acct0 = global.accounts[0];
global.acct1 = global.accounts[1];

const HillCore = contract(HillCoreContract);
HillCore.setProvider(global.web3.currentProvider);

let hillCore;

HillCore.deployed()
  .then(_hillCore => {
    hillCore = _hillCore;
    return hillCore.totalSupply();
  })
  .then(totalSupply => {
    return hillCore.generate(totalSupply, acct1, "Another Test Hill", {
      from: acct0,
      gas: 1000000
    });
  })
  .then(() => {
    return hillCore.totalSupply();
  })
  .then(totalSupply => {
    console.log("TOTAL SUPPLY", totalSupply.toString());
  })
  .catch(error => {
    console.log("ERROR : ", error);
  });
