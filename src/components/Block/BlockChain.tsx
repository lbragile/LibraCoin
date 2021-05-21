import React, { useContext } from "react";

import Block from "./Block";
import BlockTrans from "./BlockTrans";

import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";

import "./Block.scss";

export default function BlockChain(): JSX.Element {
  const { state } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  return (
    <div className="mx-3 row flex-nowrap overflow-auto">
      {state.chain.map((block, i) => (
        <div className="block" key={i}>
          <Block block={block} />
          {block.showTrans && <BlockTrans block={block} />}
        </div>
      ))}
    </div>
  );
}
