import React from "react";

import NavbarUI from "../Navbar/NavbarUI";
import ItemLineUI from "../ItemLineUI/ItemLineUI";
import BlockUI from "../Block/BlockUI";

export default function MineUI(): JSX.Element {
  return (
    <div className="container-fluid">
      <NavbarUI />

      <div id="verified-transaction">
        <ItemLineUI
          details={JSON.parse(localStorage.getItem("transactions") as string)}
          title="Verified Transactions"
        />
      </div>

      <div className="row d-flex justify-content-center align-items-center my-5 container-fluid">
        <BlockUI />
      </div>
    </div>
  );
}
