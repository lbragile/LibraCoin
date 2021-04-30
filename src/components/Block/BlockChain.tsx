import React, { useContext } from "react";

import Block from "../Block/Block";
import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";

import "./Block.css";

export default function BlockChain(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  return (
    <div id="blockchain">
      {state.chain.map((block) => {
        return (
          <div className="block-and-chain" key={Math.random()}>
            <Block details={block} />
            <div className="chain">🔗</div>
          </div>
        );
      })}
    </div>
  );
}
