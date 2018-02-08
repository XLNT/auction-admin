import ReactDOM from "react-dom";
import React from "react";
import App from "./App";

function render(App) {
  ReactDOM.render(<App />, document.getElementById("root"));
}

render(App);

if (module.hot) {
  module.hot.accept("./App", () => {
    const NewApp = require("./App");
    render(NewApp);
  });
}
