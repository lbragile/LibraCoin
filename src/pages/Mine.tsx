import React from "react";

import NavMenu from "../components/NavMenu/NavMenu";
import Block from "../components/Block/Block";
import TransactionItems from "../components/Transaction/TransactionItems";

export default function Mine(): JSX.Element {
  return (
    <div className="container-fluid">
      <NavMenu />
      <TransactionItems />

      <div className="row d-flex justify-content-center align-items-center my-2 container-fluid">
        <Block startValid={false} />
      </div>
    </div>
  );
}
