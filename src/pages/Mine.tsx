import React, { useState } from "react";

import NavMenu from "../components/NavMenu/NavMenu";
import Block from "../components/Block/Block";
import TransactionItems from "../components/Transaction/TransactionItems";
import PreviewTree from "../components/Transaction/PreviewTree";
import Statistics from "../components/Block/Statistics";

export default function Mine(): JSX.Element {
  const [merkleRoot, setMerkleRoot] = useState<string>("");

  return (
    <div>
      <NavMenu />
      <TransactionItems />
      <div className="container-fluid row d-flex justify-content-center mx-auto my-3">
        <PreviewTree setMerkleRoot={setMerkleRoot} />
        <Statistics chain={false} />
        <Block chain={false} index={0} merkleRoot={merkleRoot} />
      </div>
    </div>
  );
}
