import React, { useEffect, useState } from "react";
import BlockUI from "../Block/BlockUI";
import { Block } from "../Block/block_class";
import NavbarUI from "../Navbar/NavbarUI";

import "./Chain.css";
import { Chain } from "./chain_class";

export default function ChainUI(): JSX.Element {
  const [blockchain, setBlockchain] = useState<Block[]>(Chain.instance.blockChain);
  const [startStates, setStartStates] = useState<boolean[]>(new Array(blockchain.length).fill(true));

  useEffect(() => {
    (async () => {
      const result = await Chain.instance.updateBlocksInChain(blockchain);
      setStartStates(result.validStates);
      setBlockchain(result.blockchain);
    })();
  }, [blockchain]);

  return (
    <div>
      <NavbarUI />
      <div id="blockchain">
        {blockchain.map((block, i) => {
          return (
            <div className="block-and-chain" key={Math.random()}>
              <BlockUI details={block} startValid={startStates[i]} setBlockchain={setBlockchain} />
              <div className="chain">🔗</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
