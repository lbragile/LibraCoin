import React, { useContext, useState } from "react";
import Block from "../components/Block/Block";
import BlockTrans from "../components/Block/BlockTrans";
import Statistics from "../components/Block/Statistics";
import NavMenu from "../components/NavMenu/NavMenu";
import { AppContext } from "../context/AppContext";
import { IState } from "../typings/AppTypes";

export default function Chain(): JSX.Element {
  const { state } = useContext(AppContext) as { state: IState };

  const [solution, setSolution] = useState<string[]>(state.chain.map((block) => block.currHash));
  const [isValid, setIsValid] = useState<boolean[]>(state.chain.map((block) => block.valid));

  return (
    <div>
      <NavMenu />

      <div className="mx-3 row flex-nowrap overflow-auto">
        {state.chain.map((block, i) => (
          <div className="block mx-2 flex-column flex-shrink-0" key={block.prevHash}>
            <Block
              chain={true}
              index={i}
              merkleRoot={block.merkleRoot}
              isValid={isValid}
              setIsValid={setIsValid}
              solution={solution}
              setSolution={setSolution}
            />

            <Statistics
              chain={true}
              isValid={isValid}
              setIsValid={setIsValid}
              solution={solution}
              setSolution={setSolution}
              index={i}
              prevHash={block.prevHash}
            />

            {block.showTrans && <BlockTrans index={i} />}
          </div>
        ))}
      </div>
    </div>
  );
}
