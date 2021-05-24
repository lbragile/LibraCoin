import React, { useContext } from "react";

import Block from "./Block";
import BlockTrans from "./BlockTrans";

import { AppContext } from "../../context/AppContext";
import { IState } from "../../typings/AppTypes";

import "./Block.scss";

export default function BlockChain(): JSX.Element {
  const { state } = useContext(AppContext) as { state: IState };

  return (
    <div className="mx-3 row flex-nowrap overflow-auto">
      {state.chain.map((block) => (
        <div key={block.prevHash}>
          <Block block={block} />
          {block.showTrans && <BlockTrans index={block.index} />}
        </div>
      ))}
    </div>
  );
}
