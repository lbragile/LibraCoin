import React from "react";
import Block from "../components/Block/Block";
import BlockTrans from "../components/Block/BlockTrans";
import Statistics from "../components/Block/Statistics";
import { useAppContext } from "../hooks/useAppContext";
import { BlockContainer } from "../styles/BlockStyles";

export default function Chain(): JSX.Element {
  const { state } = useAppContext();

  return (
    <div className="mx-3 row flex-nowrap overflow-auto" role="list" aria-label="Blockchain Container">
      {state.chain.map((block) => {
        return (
          <BlockContainer
            className="mx-2 mb-4 flex-column flex-shrink-0 bg-dark"
            role="listitem"
            aria-label="Block Container"
            key={block.prevHash}
          >
            <Block chain={true} index={block.index} />
            <Statistics chain={true} index={block.index} />
            {block.showTrans && <BlockTrans index={block.index} />}
          </BlockContainer>
        );
      })}
    </div>
  );
}
