import React from "react";
import BlockUI from "../Block/BlockUI";
import NavbarUI from "../Navbar/NavbarUI";

import "./Chain.css";
import { Chain } from "./chain_class";

export default function ChainUI(): JSX.Element {
  return (
    <div>
      <NavbarUI />
      <div id="blockchain">
        {Chain.instance.blockChain.map((block) => {
          return (
            <div className="block-and-chain" key={Math.random()}>
              <BlockUI details={block} />
              <div className="chain">🔗</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
