# registry

Registry for tokenized artworks

### Getting started

Start a local blockchain like [Ganache](https://github.com/trufflesuite/ganache). You can use [Ganache CLI](https://github.com/trufflesuite/ganache-cli) or the [desktop client](http://truffleframework.com/ganache/).

```
ganache-cli
```

Add an `.env` file depending on which port ganache is running on and which port you want your server running on.

```
// .env
PORT=6000
RPC_HOST="127.0.0.1"
RPC_PORT=8545
```

Install packages

```
yarn install
```

### Note:

Ensure your truffle version is:

```
Truffle v4.0.6 (core: 4.0.6)
Solidity v0.4.19 (solc-js)
```


Compile and migrate your local smart contracts.

```
truffle migrate --reset
```

To add an ERC821 CryptoHill to account index 1 run:

```
node script.js
```
