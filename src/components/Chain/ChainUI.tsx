import React from "react";
import BlockUI from "../Block/BlockUI";
import { Block } from "../Block/block_class";
import NavbarUI from "../Navbar/NavbarUI";
import { Chain } from "./chain_class";

import "./Chain.css";

export default function ChainUI(): JSX.Element {
  return (
    <div>
      <NavbarUI />

      <div id="blockchain">
        {Chain.instance.blockChain.map((block: Block) => {
          return <BlockUI block={block} useChain={true} key={Math.random()} />;
        })}
      </div>
    </div>
  );
}
