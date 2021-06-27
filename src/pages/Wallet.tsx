import React from "react";

import NavMenu from "../components/NavMenu/NavMenu";
import KeyGeneration from "../components/User/KeyGeneration";
import UserItems from "../components/User/UserItems";
import Sign from "../components/Transaction/Sign";
import Send from "../components/Transaction/Send";

export default function Wallet(): JSX.Element {
  return (
    <div>
      <NavMenu />

      <KeyGeneration />

      <div className="container-fluid d-flex justify-content-center mx-auto row my-4">
        <Sign />
        <Send />
      </div>

      <UserItems />
    </div>
  );
}
