import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { observable, action } from "mobx";
import { field, identity } from "bidi-mobx";

@inject("store")
@observer
export default class Upload extends Component {
  @observable file = null;

  // Fields
  nameField = field(identity()).create("");
  descriptionField = field(identity()).create("");
  creatorField = field(identity()).create("");

  handleFile = e => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onload = e => {
      this.file = {
        path: file.name,
        content: new Buffer(e.target.result)
      };
      this.fileErrorMessage = null;
    };
    reader.readAsArrayBuffer(file);
  };

  @action
  handleInputChange(field, event) {
    field.set(event.target.value);
  }

  async submitForm() {
    if (this.file == null) {
      this.fileErrorMessage = "Please add a file!";
    } else {
      const [fileResponse] = await this.props.store.ipfsNode.files.add([
        this.file
      ]);

      const data = {
        name: this.nameField.model,
        description: this.descriptionField.model,
        creator: this.creatorField.model,
        resourceIdentifiers: {
          default: fileResponse.hash
        }
      };

      const obj = {
        Data: new Buffer(JSON.stringify(data)),
        Links: []
      };

      const node = await this.props.store.ipfsNode.object.put(obj);

      this.props.onUpload(node.toJSON().multihash);
    }
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFile} />
        <br />
        <div>
          Name:
          <input
            type="text"
            value={this.nameField.model}
            onChange={e => this.handleInputChange(this.nameField, e)}
          />
        </div>
        <div>
          Creator:
          <input
            type="text"
            value={this.creatorField.model}
            onChange={e => this.handleInputChange(this.creatorField, e)}
          />
        </div>
        <div>
          Description:
          <textarea
            value={this.descriptionField.model}
            onChange={e => this.handleInputChange(this.descriptionField, e)}
          />
        </div>
        <div>
          <button onClick={() => this.submitForm()}>Submit</button>
        </div>
      </div>
    );
  }
}
