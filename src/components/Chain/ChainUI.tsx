import React, { useEffect } from "react";
import BlockUI from "../Block/BlockUI";
import { Block } from "../Block/block_class";
import NavbarUI from "../Navbar/NavbarUI";
import { Chain } from "./chain_class";

export default function ChainUI(): JSX.Element {
  useEffect(() => {
    console.log(Chain.instance.blockChain);
  }, []);

  return (
    <div>
      <NavbarUI />

      <div className="container-fluid mx-3 row">
        {Chain.instance.blockChain.map((block: Block) => {
          return <BlockUI block={block} useChain={true} key={Math.random()} />;
        })}
      </div>
    </div>
  );
}
