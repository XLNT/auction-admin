import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider, observer } from "mobx-react";
import CuratorAssetList from "./CuratorAssetList";

@observer
export default class App extends Component {
  render() {
    if (!this.props.store.isReady) {
      return <div>Setting up...</div>;
    }
    return (
      <Provider store={this.props.store}>
        <Router>
          <div>
            <Route exact path="/" component={CuratorAssetList} />
          </div>
        </Router>
      </Provider>
    );
  }
}
