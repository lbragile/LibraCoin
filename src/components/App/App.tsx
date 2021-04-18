import React from "react";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";

import WalletUI from "../Wallet/WalletUI";
import ChainUI from "../Chain/ChainUI";
import MineUI from "../Mine/MineUI";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App(): JSX.Element {
  return (
    <Router basename={"/LibraCoin"}>
      <Route exact path="/">
        <Redirect to="/wallet" />
      </Route>
      <Route path="/wallet" component={WalletUI} />
      <Route path="/mine" component={MineUI} />
      <Route path="/blockchain" component={ChainUI} />
    </Router>
  );
}
