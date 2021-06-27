import React from "react";

import NavMenu from "../components/NavMenu/NavMenu";
import Block from "../components/Block/Block";
import TransactionItems from "../components/Transaction/TransactionItems";
import PreviewTree from "../components/Block/PreviewTree";
import Statistics from "../components/Block/Statistics";

export default function Mine(): JSX.Element {
  return (
    <div>
      <NavMenu />
      <TransactionItems />
      <div className="container-fluid row d-flex justify-content-center mx-auto my-3">
        <PreviewTree />
        <Statistics chain={false} index={0} />
        <Block chain={false} index={0} />
      </div>
    </div>
  );
}
