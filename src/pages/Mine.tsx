import React from "react";

import NavbarUI from "../components/Navbar/NavbarUI";
import BlockUI from "../components/Block/BlockUI";
import TransactionItems from "../components/Transaction/TransactionItems";

export default function Mine(): JSX.Element {
  return (
    <div className="container-fluid">
      <NavbarUI />

      <div id="verified-transaction">
        <TransactionItems />
      </div>

      <div className="row d-flex justify-content-center align-items-center my-2 container-fluid">
        <BlockUI startValid={false} />
      </div>
    </div>
  );
}
