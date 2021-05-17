import React, { useContext } from "react";

import Block from "./Block";
import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";

import "./Block.css";

export default function BlockChain(): JSX.Element {
  const { state } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  return (
    <div className="mx-3 row flex-nowrap overflow-auto">
      {state.chain.map((block) => (
        <Block block={block} key={Math.random()} />
      ))}
    </div>
  );
}
