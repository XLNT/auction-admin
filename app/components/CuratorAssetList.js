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
  }

  get curator() {
    return this.props.store.curator;
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
    const data = await this.curator.assetData(_id, currentBlock);
    return { id: _id, data };
  }

  async generateAsset() {
    const receipt = await this.curator.generate(
      this.totalCount,
      this.props.store.currentAccount,
      `Asset number ${this.totalCount.toString()}`,
      { from: this.props.store.currentAccount }
    );
  }

  render() {
    return (
      <div>
        Current account: {this.props.store.currentAccount}
        <div>Total count: {this.totalCount && this.totalCount.toString()}</div>
        {this.assets.map(asset => <div key={asset.id}>{asset.data}</div>)}
        <div>
          <div>Create asset:</div>
          <Upload />
        </div>
      </div>
    );
  }
}
