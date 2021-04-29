import React from "react";

import NavbarUI from "../components/Navbar/NavbarUI";
import ItemLineUI from "../components/ItemLineUI/ItemLineUI";
import BlockUI from "../components/Block/BlockUI";

export default function Mine(): JSX.Element {
  return (
    <div className="container-fluid">
      <NavbarUI />

      <div id="verified-transaction">
        <ItemLineUI title="Verified Transactions" />
      </div>

      <div className="row d-flex justify-content-center align-items-center my-2 container-fluid">
        <BlockUI startValid={false} />
      </div>
    </div>
  );
}
