import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App/App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/scss/bootstrap.scss";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// so that app works offline and loads faster due to caching
serviceWorker.register();

// https://bit.ly/CRA-vitals
reportWebVitals(console.log);
