import React from "react";

import KeyGeneration from "../components/User/KeyGeneration";
import Sign from "../components/Transaction/Sign";
import Send from "../components/Transaction/Send";
import UserItems from "../components/User/UserItems";

export default function Wallet(): JSX.Element {
  return (
    <React.Fragment>
      <KeyGeneration />

      <div className="container-fluid d-flex justify-content-center mx-auto row my-4">
        <Sign />
        <Send />
      </div>

      <UserItems />
    </React.Fragment>
  );
}
