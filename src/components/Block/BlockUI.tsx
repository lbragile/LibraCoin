import React from "react";
import { Transaction } from "../Transaction/transaction_class";

interface IBlock {
  index: number;
  prevHash: string;
  currHash: string;
  transactions: Transaction[];
  timestamp: number;
}

export default function BlockUI({ details }: { details: IBlock[] }): JSX.Element {
  return (
    <div>
      {details.map((block) => (
        <React.Fragment key={Math.random()}>
          <div>{block.index}</div>
          <div>{block.prevHash}</div>
          <div>{block.currHash}</div>
          <div>{JSON.stringify(block.transactions)}</div>
          <div>{block.timestamp}</div>
        </React.Fragment>
      ))}
    </div>
  );
}
