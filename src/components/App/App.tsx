import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import WalletUI from "../Wallet/WalletUI";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import NavbarUI from "../Navbar/NavbarUI";

export default function App(): JSX.Element {
  return (
    <Router>
      <Route path="/" component={WalletUI} exact />
      <Route path="/wallet" component={WalletUI} />
      <Route path="/mine" component={NavbarUI} />
      <Route path="/blockchain" component={NavbarUI} />
    </Router>
  );
}
