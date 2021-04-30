import React from "react";

import NavMenu from "../components/NavMenu/NavMenu";
import KeyGeneration from "../components/User/KeyGeneration";
import Transaction from "../components/Transaction/Transaction";
import UserItems from "../components/User/UserItems";

export default function Wallet(): JSX.Element {
  return (
    <div className="container-fluid my-3">
      <NavMenu />
      <KeyGeneration />
      <Transaction />
      <UserItems />
    </div>
  );
}
