import React from "react";

import NavMenu from "../components/NavMenu/NavMenu";
import PreviewBlock from "../components/Block/PreviewBlock";
import TransactionItems from "../components/Transaction/TransactionItems";

export default function Mine(): JSX.Element {
  return (
    <div className="container-fluid">
      <NavMenu />
      <TransactionItems />
      <PreviewBlock />
    </div>
  );
}
