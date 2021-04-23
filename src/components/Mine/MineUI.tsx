import React, { useState } from "react";

import NavbarUI from "../Navbar/NavbarUI";
import ItemLineUI from "../ItemLineUI/ItemLineUI";
import StatisticsUI from "./StatisticsUI";
import BlockUI from "../Block/BlockUI";

import "./Mine.css";

export default function MineUI(): JSX.Element {
  const [solution, setSolution] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showBtn, setShowBtn] = useState<boolean>(true);

  return (
    <div className="container-fluid">
      <NavbarUI />

      <div id="verified-transaction">
        <ItemLineUI
          details={JSON.parse(localStorage.getItem("transactions") as string)}
          title="Verified Transactions"
        />
      </div>

      <div className="row d-flex justify-content-center align-items-center my-5 container-fluid">
        <StatisticsUI
          chain={false}
          setShowBtn={setShowBtn}
          solution={solution}
          setSolution={setSolution}
          isValid={isValid}
          setIsValid={setIsValid}
        />

        <BlockUI chain={false} isValid={isValid} showBtn={showBtn} solution={solution} setShowBtn={setShowBtn} />
      </div>
    </div>
  );
}
