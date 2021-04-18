import React, { useRef } from "react";
import NavbarUI from "../Navbar/NavbarUI";
import { IBlock } from "../Block/BlockUI";

import "./Mine.css";
import { Button } from "react-bootstrap";

interface IStats {
  nonce: number;
  target: string;
  solution: string;
}

export default function MineUI(): JSX.Element {
  const minedBlock = useRef<IBlock>({
    index: 0,
    timestamp: Date.now(),
    prevHash: "00000000000000000...",
    currHash: "000absd234hdsf84h5...",
    transactions: [],
  });

  const stats = useRef<IStats>({ nonce: 654, target: "000wld823nfwe3024rin...", solution: "000absd234hdsf84h5..." });

  return (
    <div className="container-fluid">
      <NavbarUI />

      <div id="verified-transaction">
        <h3>Verified Transactions:</h3>
      </div>

      <div className="row">
        <div id="mine-interactive-area">
          <div id="statistics">
            <p>
              <b>Nonce:</b> {stats.current.nonce}
            </p>
            <p>
              <b>Target:</b> {stats.current.target}
            </p>
            <p>
              <b>Solution:</b> {stats.current.solution}
            </p>
          </div>

          <Button variant="primary" id="mine-add-block">
            Mine
          </Button>
        </div>

        <div id="mined-block" className="valid-block">
          <Button variant="success" id="mine-add-block">
            +
          </Button>
          <p>
            <b>Index:</b> {minedBlock.current.index}
          </p>
          <p>
            <b>Timestamp:</b> {minedBlock.current.timestamp}
          </p>
          <p>
            <b>Previous Hash:</b> {minedBlock.current.prevHash}
          </p>
          <p>
            <b>Current Hash:</b> {minedBlock.current.currHash}
          </p>
          <p>
            <b>Merkle Root:</b> {"4h354kdnf380sdf234..."}
          </p>
        </div>
      </div>
    </div>
  );
}
