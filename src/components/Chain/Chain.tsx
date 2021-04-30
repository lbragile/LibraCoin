import React from "react";
import Block from "../Block/Block";
import NavMenu from "../NavMenu/NavMenu";

import "./Chain.css";

export default function Chain(): JSX.Element {
  return (
    <div>
      <NavMenu />
      <div id="blockchain">
        {[].map((block) => {
          return (
            <div className="block-and-chain" key={Math.random()}>
              <Block details={block} startValid={false} />
              <div className="chain">🔗</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
