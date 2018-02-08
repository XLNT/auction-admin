import React, { Component } from "react";

import IPFS from "ipfs";

// const node = new IPFS();

// console.log(node);

// window.node = node;

// const buffer = new Buffer("Paul Fletcher-Hill knows IPFS woo!!!");

// console.log(buffer);
// window.buffer = buffer;

// const files = [
//   {
//     path: "helloworld.txt",
//     content: buffer
//   }
// ];

// node.on("ready", () => {
//   // We've got a node
//   console.log("ready");

//   node.swarm.addrs().then(peers => {
//     console.log(peers);
//   });
// });

// window.files = files;

export default class App extends Component {
  state = { hash: null };

  componentDidMount() {
    this.node = new IPFS();
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
          this.setState({
            hash: objects[0].hash
          });
        });
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFile} />
        <br />
        {this.state.hash && (
          <a href={"https://ipfs.io/ipfs/" + this.state.hash}>View Here</a>
        )}
      </div>
    );
  }
}
