import React from "react";

import NavbarUI from "../components/Navbar/NavbarUI";
import KeyGeneration from "../components/Wallet/KeyGeneration";
import TransactionUI from "../components/Transaction/TransactionUI";
import UserItems from "../components/User/UserItems";

export default function WalletUI(): JSX.Element {
  return (
    <div className="container-fluid my-3">
      <NavbarUI />
      <KeyGeneration />
      <TransactionUI />
      <UserItems />
    </div>
  );
}
