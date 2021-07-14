import React from "react";
import ReactDOM from "react-dom";
import { createHttpLink, ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

import App from "./components/App/App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/scss/bootstrap.scss";

const client = new ApolloClient({
  link: createHttpLink({ uri: "http://localhost:4000/api/graphql" }),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// so that app works offline and loads faster due to caching
serviceWorker.register();

// https://bit.ly/CRA-vitals
reportWebVitals(console.log);
