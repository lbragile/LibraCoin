import React from "react";

import TransactionItems from "../components/Transaction/TransactionItems";
import PreviewTree from "../components/Block/PreviewTree";
import Statistics from "../components/Block/Statistics";
import Block from "../components/Block/Block";

export default function Mine(): JSX.Element {
  return (
    <React.Fragment>
      <TransactionItems />

      <div className="container-fluid row d-flex justify-content-center mx-auto my-3">
        <PreviewTree />
        <Statistics chain={false} index={0} />
        <Block chain={false} index={0} />
      </div>
    </React.Fragment>
  );
}
