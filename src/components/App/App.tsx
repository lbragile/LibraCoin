import React, { useMemo, useReducer } from "react";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";

import Wallet from "../../pages/Wallet";
import Chain from "../../pages/Chain";
import Mine from "../../pages/Mine";

import { AppReducer } from "../../reducers/AppReducer";
import { AppContext } from "../../context/AppContext";

import "./App.scss";

export default function App(): JSX.Element {
  const [state, dispatch] = useReducer(AppReducer, {
    verifiedTrans: JSON.parse(localStorage.getItem("verTrans") as string) ?? [],
    selectedTrans: JSON.parse(localStorage.getItem("selTrans") as string) ?? [],
    users: JSON.parse(localStorage.getItem("users") as string) ?? [],
    user: JSON.parse(localStorage.getItem("user") as string) ?? { publicKey: "", privateKey: "", balance: 1000.0 },
    chain: JSON.parse(localStorage.getItem("chain") as string) ?? [
      {
        index: 0,
        prevHash: "",
        currHash: new Array(64).fill("0").join(""),
        transactions: [],
        timestamp: Date.parse("31 Apr 2021 00:00:00 UTC"),
        merkleRoot: "",
        valid: true
      }
    ],
    preview: JSON.parse(localStorage.getItem("preview") as string) ?? {
      index: 1,
      prevHash: new Array(64).fill("0").join(""),
      currHash: "",
      transactions: [],
      timestamp: Date.parse("31 Apr 2021 00:00:00 UTC"),
      merkleRoot: "",
      valid: false
    }
  });

  // prevent re-rendering children when App re-renders
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <Router basename={"/LibraCoin"}>
      <AppContext.Provider value={value}>
        <Route exact path="/">
          <Redirect to="/wallet" />
        </Route>
        <Route path="/wallet" component={Wallet} />
        <Route path="/mine" component={Mine} />
        <Route path="/blockchain" component={Chain} />
      </AppContext.Provider>
    </Router>
  );
}
