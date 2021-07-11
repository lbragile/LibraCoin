import React, { useRef, useState } from "react";
import { Pagination } from "react-bootstrap";
import Block from "../components/Block/Block";
import BlockTrans from "../components/Block/BlockTrans";
import Statistics from "../components/Block/Statistics";
import { useAppContext } from "../hooks/useAppContext";
import { BlockContainer } from "../styles/BlockStyles";

export default function Chain(): JSX.Element {
  const { state } = useAppContext();

  const NUM_ITEMS = useRef<number>(5);
  const [page, setPage] = useState<number>(0);

  function getPaginationItems(): JSX.Element[] {
    const itemNum = [] as number[];
    const firstThree = [0, 1, 2];
    const lastThree = [state.chain.length - 3, state.chain.length - 2, state.chain.length - 1];
    const isTooLong = state.chain.length >= 2 * NUM_ITEMS.current;
    if (isTooLong && 3 <= page && page < state.chain.length - 3) {
      itemNum.push(...firstThree, -1, page, -1, ...lastThree);
    } else if (isTooLong) {
      itemNum.push(...firstThree, -1, ...lastThree);
    } else {
      itemNum.push(...Array(state.chain.length).keys());
    }

    return itemNum.map((val, i) =>
      val !== -1 ? (
        <Pagination.Item key={"page-" + val} active={page === val} onClick={() => setPage(val)}>
          {val}
        </Pagination.Item>
      ) : (
        <Pagination.Ellipsis key={"page-ellipsis-" + i} disabled />
      )
    );
  }

  return (
    <>
      <div className="justify-content-center row flex-nowrap mx-3" role="list" aria-label="Blockchain Container">
        {state.chain.map((block, i) => {
          return (
            ((i < NUM_ITEMS.current && page < NUM_ITEMS.current) || (page - NUM_ITEMS.current < i && i <= page)) && (
              <BlockContainer
                className="mx-2 flex-column flex-shrink-0"
                role="listitem"
                aria-label="Block Container"
                key={block.prevHash}
              >
                <Block chain={true} index={block.index} />
                <Statistics chain={true} index={block.index} />
                {block.showTrans && <BlockTrans index={block.index} />}
              </BlockContainer>
            )
          );
        })}
      </div>

      <Pagination size="lg" className="justify-content-center mt-2">
        <Pagination.First onClick={() => setPage(0)} />
        <Pagination.Prev onClick={() => setPage(Math.max(0, page - 1))} />
        {getPaginationItems()}
        <Pagination.Next onClick={() => setPage(Math.min(page + 1, state.chain.length - 1))} />
        <Pagination.Last onClick={() => setPage(state.chain.length - 1)} />
      </Pagination>
    </>
  );
}
