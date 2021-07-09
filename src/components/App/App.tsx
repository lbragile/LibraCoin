import React, { useMemo, useReducer, Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import logger from "use-reducer-logger";

import { AppReducer } from "../../reducers/AppReducer";
import { AppContext } from "../../context/AppContext";

import { GlobalStyle } from "../../styles/GlobalStyles";
import Loading from "./Loading";

// Code Splitting & Lazy Loading
const NavMenu = lazy(() => import("../NavMenu/NavMenu"));
const Wallet = lazy(() => import("../../pages/Wallet"));
const Mine = lazy(() => import("../../pages/Mine"));
const Chain = lazy(() => import("../../pages/Chain"));

export default function App(): JSX.Element {
  const [state, dispatch] = useReducer(process.env.NODE_ENV === "development" ? logger(AppReducer) : AppReducer, {
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
    copied: "",
    preview: JSON.parse(localStorage.getItem("preview") as string) ?? {
      index: 1,
      prevHash: new Array(64).fill("0").join(""),
      currHash: "",
      transactions: [],
      timestamp: Date.parse("31 Apr 2021 00:00:00 UTC"),
      merkleRoot: "",
      valid: false
    },
    wallet: JSON.parse(localStorage.getItem("wallet") as string) ?? {
      sent: false,
      signed: false,
      validated: false,
      details: { from: "", to: "", amount: (0).toFixed(2), msg: "", signature: "" }
    }
  });

  // prevent re-rendering children when App re-renders
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <React.Fragment>
      <GlobalStyle />

      <Suspense fallback={<Loading />}>
        <NavMenu />
      </Suspense>

      <AppContext.Provider value={value}>
        <Router basename={"/LibraCoin"}>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route exact path="/">
                <Redirect to="/wallet" />
              </Route>
              <Route path="/wallet" component={Wallet} />
              <Route path="/mine" component={Mine} />
              <Route path="/blockchain" component={Chain} />
            </Switch>
          </Suspense>
        </Router>
      </AppContext.Provider>
    </React.Fragment>
  );
}
