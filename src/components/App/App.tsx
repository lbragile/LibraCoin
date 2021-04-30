import React, { useMemo, useReducer } from "react";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";

import Wallet from "../../pages/Wallet";
import Chain from "../Chain/Chain";
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
