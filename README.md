# registry

Registry for tokenized artworks

### Getting started

Start a local blockchain like [Ganache](https://github.com/trufflesuite/ganache). You can use [Ganache CLI](https://github.com/trufflesuite/ganache-cli) or the [desktop client](http://truffleframework.com/ganache/).

```
ganache-cli
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
