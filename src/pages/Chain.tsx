import React, { useContext } from "react";
import Block from "../components/Block/Block";
import BlockTrans from "../components/Block/BlockTrans";
import Statistics from "../components/Block/Statistics";
import NavMenu from "../components/NavMenu/NavMenu";
import { AppContext } from "../context/AppContext";
import { IState } from "../typings/AppTypes";

export default function Chain(): JSX.Element {
  const { state } = useContext(AppContext) as { state: IState };

  return (
    <div>
      <NavMenu />

      <div className="mx-3 row flex-nowrap overflow-auto">
        {state.chain.map((block) => (
          <div className="block mx-2 flex-column flex-shrink-0" key={block.prevHash}>
            <Block chain={true} index={block.index} />
            <Statistics chain={true} index={block.index} prevHash={block.prevHash} />
            {block.showTrans && <BlockTrans index={block.index} />}
          </div>
        ))}
      </div>
    </div>
  );
}
