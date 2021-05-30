import React, { useState } from "react";

import NavMenu from "../components/NavMenu/NavMenu";
import Block from "../components/Block/Block";
import TransactionItems from "../components/Transaction/TransactionItems";
import PreviewTree from "../components/Transaction/PreviewTree";
import Statistics from "../components/Block/Statistics";

export default function Mine(): JSX.Element {
  const [merkleRoot, setMerkleRoot] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean[]>([false]);
  const [solution, setSolution] = useState<string[]>([""]);

  return (
    <div>
      <NavMenu />
      <TransactionItems />
      <div className="container-fluid row d-flex justify-content-center mx-auto my-3">
        <PreviewTree setMerkleRoot={setMerkleRoot} setIsValid={setIsValid} />

        <Statistics
          chain={false}
          isValid={isValid}
          setIsValid={setIsValid}
          solution={solution}
          setSolution={setSolution}
        />

        <Block
          chain={false}
          merkleRoot={merkleRoot}
          isValid={isValid}
          setIsValid={setIsValid}
          solution={solution}
          setSolution={setSolution}
        />
      </div>
    </div>
  );
}
