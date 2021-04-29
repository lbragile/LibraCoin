import React, { useReducer } from "react";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";

import WalletUI from "../Wallet/WalletUI";
import ChainUI from "../Chain/ChainUI";
import Mine from "../../pages/Mine";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { AppReducer } from "../../reducers/AppReducer";
import { AppContext } from "../../context/AppContext";

export default function App(): JSX.Element {
  const [state, dispatch] = useReducer(AppReducer, {
    verifiedTrans: JSON.parse(localStorage.getItem("transactions") as string) ?? [],
    selectedTrans: JSON.parse(localStorage.getItem("selectedTransactions") as string) ?? [],
    users: JSON.parse(localStorage.getItem("users") as string) ?? [],
  });

  return (
    <Router basename={"/LibraCoin"}>
      <AppContext.Provider value={{ state, dispatch }}>
        <Route exact path="/">
          <Redirect to="/wallet" />
        </Route>
        <Route path="/wallet" component={WalletUI} />
        <Route path="/mine" component={Mine} />
        <Route path="/blockchain" component={ChainUI} />
      </AppContext.Provider>
    </Router>
  );
}
