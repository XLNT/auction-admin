import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { observable, action, when, observe } from "mobx";
import Upload from "./Upload";

@inject("store")
@observer
export default class CuratorAssetList extends Component {
  @observable totalCount;
  @observable assets = [];

  componentDidMount() {
    this.getTotalCount();
    const blockWatcher = observe(
      this.props.store,
      "currentBlock",
      change => {
        this.getTotalCount();
      },
      true
    );
    const countWatcher = observe(this, "totalCount", change => {
      this.getAssets();
    });
    console.log(
      this.props.store.auctionBase.address,
      this.props.store.curator.address,
      this.props.store.currentAccount
    );
  }

  get curator() {
    return this.props.store.curator;
  }

  get auctionBase() {
    return this.props.store.auctionBase;
  }

  async getTotalCount() {
    this.totalCount = await this.curator.totalSupply(
      this.props.store.currentBlock
    );
  }

  async getAssets() {
    if (this.totalCount == 0) return false;
    const promises = [];
    for (let i = 0; i < this.totalCount; i++) {
      promises.push(this.importAsset(i));
    }
    this.assets = await Promise.all(promises);
  }

  async importAsset(_id) {
    const { currentBlock } = this.props.store;
    const owner = await this.curator.ownerOf(_id, currentBlock);
    const data = await this.curator.assetData(_id, currentBlock);
    const approved = await this.curator.isApprovedFor(
      this.auctionBase.address,
      _id,
      currentBlock
    );
    return { id: _id, data, owner, approved };
  }

  async approveAssetForAuction(asset) {
    const receipt = await this.curator.approve(
      this.auctionBase.address,
      asset.id,
      { from: this.props.store.currentAccount }
    );
  }

  generateAssetWithMetadata = async metadataHash => {
    const receipt = await this.curator.generate(
      this.totalCount,
      this.props.store.currentAccount,
      metadataHash,
      { from: this.props.store.currentAccount }
    );
  };

  async createAuction(asset) {
    const bidIncrement = this.props.store.web3.toWei(0.1, "ether");
    const duration = 60 * 60 * 8; // 8 hours
    console.log(
      this.curator.address,
      asset.id,
      bidIncrement,
      duration,
      this.props.store.currentAccount
    );
    const receipt = await this.auctionBase.createAuction(
      this.curator.address,
      asset.id,
      bidIncrement,
      duration,
      { from: this.props.store.currentAccount }
    );
    console.log(receipt);
  }

  render() {
    return (
      <div>
        Current account: {this.props.store.currentAccount}
        <div>Total count: {this.totalCount && this.totalCount.toString()}</div>
        {this.assets.map(asset => (
          <div key={asset.id}>
            {asset.approved && "[Approved]"} {asset.data} {asset.owner}{" "}
            {asset.approved ? (
              <button onClick={() => this.createAuction(asset)}>
                Create Auction
              </button>
            ) : (
              <button onClick={() => this.approveAssetForAuction(asset)}>
                Approve
              </button>
            )}
          </div>
        ))}
        <div>
          <div>Create asset:</div>
          <Upload onUpload={this.generateAssetWithMetadata} />
        </div>
      </div>
    );
  }
}
