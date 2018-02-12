import { action, observable, computed } from "mobx";
import contract from "truffle-contract";
import { Curator } from "curator-contracts";
import { AuctionBase } from "auction-contracts";
import IPFS from "ipfs";

export default class Store {
  @observable currentAccount = null;
  @observable currentBlock = "latest";
  @observable curator;
  @observable auctionBase;

  constructor(web3) {
    this.web3 = web3;
    this.ipfsNode = new IPFS();
    this.accountInterval = setInterval(() => this.setCurrentAccount(), 500); // Ugh ಠ_ಠ
    this.blockInterval = setInterval(() => this.setCurrentBlock(), 1000);
    // Setup AuctionBase contract
    const AuctionBaseContract = contract(AuctionBase);
    AuctionBaseContract.setProvider(this.web3.currentProvider);
    AuctionBaseContract.deployed().then(instance => {
      this.auctionBase = instance;
    });
    // Setup Curator contract
    const CuratorContract = contract(Curator);
    CuratorContract.setProvider(this.web3.currentProvider);
    CuratorContract.deployed().then(instance => {
      this.curator = instance;
    });
    window.s = this;
  }

  @computed
  get isReady() {
    return (
      this.currentAccount &&
      this.currentBlock &&
      this.curator &&
      this.auctionBase
    );
  }

  setCurrentAccount() {
    this.web3.eth.getAccounts(
      action((error, accounts) => {
        this.currentAccount = accounts[0];
      })
    );
  }

  setCurrentBlock() {
    this.web3.eth.getBlock(
      "latest",
      action((err, res) => {
        if (res.number != this.currentBlock) {
          console.log(
            "Changing current block from",
            this.currentBlock,
            "to",
            res.number
          );
          this.currentBlock = res.number;
        }
      })
    );
  }
}
