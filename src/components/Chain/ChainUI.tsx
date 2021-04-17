import React from "react";
import BlockUI from "../Block/BlockUI";
import NavbarUI from "../Navbar/NavbarUI";

export default function ChainUI(): JSX.Element {
  return (
    <div>
      <NavbarUI />
      <BlockUI
        details={[
          {
            index: 0,
            prevHash: "",
            currHash: "0000000000000000000000000000000000000000000",
            transactions: [],
            timestamp: Date.now(),
          },
        ]}
      />
    </div>
  );
}
