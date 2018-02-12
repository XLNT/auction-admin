import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { observable, action } from "mobx";
import { field, identity } from "bidi-mobx";
import IPFS from "ipfs";

@inject("store")
@observer
export default class Upload extends Component {
  @observable links = [];
  @observable name = "";
  @observable artist = "";

  // Fields
  nameField = field(identity()).create("");
  artistField = field(identity()).create("");

  componentDidMount() {
    this.node = new IPFS();
    window.n = this.node;
  }

  handleFile = e => {
    console.log(e.target.files);
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onload = e => {
      console.log(file.name, e.target.result);
      this.node.files
        .add([
          {
            path: file.name,
            content: new Buffer(e.target.result)
          }
        ])
        .then(objects => {
          this.links = [...this.links, ...objects];
        });
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  };

  @action
  handleInputChange(field, event) {
    field.set(event.target.value);
  }

  async submitForm() {
    const data = {
      name: this.nameField.model,
      artist: this.artistField.model
    };
    const res = await this.node.object.put({
      Data: new Buffer(JSON.stringify(data)),
      Links: this.links
    });
    console.log(res);
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFile} />
        <br />
        {this.hash && (
          <a href={"https://ipfs.io/ipfs/" + this.hash}>
            View Here {this.hash}
          </a>
        )}
        <div>
          Name:
          <input
            type="text"
            value={this.nameField.model}
            onChange={e => this.handleInputChange(this.nameField, e)}
          />
        </div>
        <div>
          Artist:
          <input
            type="text"
            value={this.artistField.model}
            onChange={e => this.handleInputChange(this.artistField, e)}
          />
        </div>
        <div>
          <button onClick={() => this.submitForm()}>Submit</button>
        </div>
      </div>
    );
  }
}
