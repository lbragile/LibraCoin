import React, { useState } from "react";
import BlockUI from "../Block/BlockUI";
import StatisticsUI from "../Mine/StatisticsUI";
import NavbarUI from "../Navbar/NavbarUI";

import "./Chain.css";

export default function ChainUI(): JSX.Element {
  const [solution, setSolution] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showBtn, setShowBtn] = useState<boolean>(true);

  return (
    <div>
      <NavbarUI />
      <BlockUI chain={true} isValid={isValid} showBtn={showBtn} solution={solution} setShowBtn={setShowBtn}>
        <StatisticsUI
          chain={true}
          setShowBtn={setShowBtn}
          solution={solution}
          setSolution={setSolution}
          isValid={isValid}
          setIsValid={setIsValid}
        />
      </BlockUI>
    </div>
  );
}
