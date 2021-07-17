import React, { useMemo, useReducer, Suspense, lazy, useEffect } from "react";
import { Route, BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import logger from "use-reducer-logger";

import { AppReducer } from "../../reducers/AppReducer";
import { AppContext } from "../../context/AppContext";
import { IState } from "../../typings/AppTypes";

import { GlobalStyle } from "../../styles/GlobalStyles";
import Loading from "./Loading";
import { useUserDetailsQuery } from "../../graphql/generated/graphql";

// Code Splitting & Lazy Loading
const NavMenu = lazy(() => import("../NavMenu/NavMenu"));
const Wallet = lazy(() => import("../../pages/Wallet"));
const Mine = lazy(() => import("../../pages/Mine"));
const Chain = lazy(() => import("../../pages/Chain"));

export default function App(): JSX.Element {
  const initialState: IState = JSON.parse(localStorage.getItem("state") as string) ?? {
    chain: [
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
    preview: {
      index: 1,
      prevHash: new Array(64).fill("0").join(""),
      currHash: "",
      transactions: [],
      timestamp: Date.parse("31 Apr 2021 00:00:00 UTC"),
      merkleRoot: "",
      valid: false
    },
    selectedTrans: [],
    user: { publicKey: "", privateKey: "", balance: 1000.0 },
    users: [],
    verifiedTrans: [],
    wallet: {
      sent: false,
      signed: false,
      validated: false,
      details: { from: "", to: "", amount: (0).toFixed(2), msg: "", signature: "" }
    }
  };

  const [state, dispatch] = useReducer(
    process.env.NODE_ENV === "development" ? logger(AppReducer) : AppReducer,
    initialState
  );

  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state, null, 2));
  }, [state]);

  // prevent re-rendering children when App re-renders
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  const { loading, error, data } = useUserDetailsQuery({
    variables: {
      publicKey:
        "4059301306072a8648ce3d020106082a8648ce3d03010703420004d1721b57ccb14b60db3729371cee21eb48c7da633582c026fbb2a80aade0a4b5990b3220d30458fdd2e467294ac88911759e3527fd939248148f4e0ff5df8c70"
    }
  });

  return (
    <React.Fragment>
      <GlobalStyle />

      <Suspense fallback={<Loading />}>
        <NavMenu />
      </Suspense>

      {loading ? (
        <p>Loading ...</p>
      ) : error ? (
        <p>{JSON.stringify(error)}</p>
      ) : (
        <p>{JSON.stringify(data?.userDetails)}</p>
      )}

      <AppContext.Provider value={value}>
        <Router>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Redirect exact from="/" to="/wallet" />
              <Route path="/wallet" component={Wallet} />
              <Route path="/mine" component={Mine} />
              <Route path="/blockchain" component={Chain} />
              <Redirect from="*" to="/wallet" />
            </Switch>
          </Suspense>
        </Router>
      </AppContext.Provider>
    </React.Fragment>
  );
}
