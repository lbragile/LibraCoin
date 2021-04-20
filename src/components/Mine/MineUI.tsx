import React, { useRef, useState } from "react";
import NavbarUI from "../Navbar/NavbarUI";
import { IBlock } from "../Block/BlockUI";

import "./Mine.css";
import { Button, Form } from "react-bootstrap";
import BoxItemLineUI from "../BoxItemLineUI/BoxItemLineUI";
import { Chain } from "../Chain/chain_class";

export default function MineUI(): JSX.Element {
  const minedBlock = useRef<IBlock>({
    index: 0,
    timestamp: Date.now(),
    prevHash: "00000000000000000...",
    currHash: "000absd234hdsf84h5...",
    transactions: [],
  });

  const [nonce, setNonce] = useState<number>();
  const [solution, setSolution] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const origNonce = useRef<number>();

  async function createTarget(numZeros: number) {
    let targetHash = await Chain.instance.digestMessage(Chain.instance.randomHash(20));

    // replace leading bits with zeros
    const re = new RegExp(`^.{0,${numZeros}}`, "g");
    const zerosStr = Array(numZeros).fill("0").join("");
    targetHash = targetHash.replace(re, zerosStr);
    setTarget(targetHash);
  }

  async function handleMine() {
    setIsValid(false);
    origNonce.current = Math.round(Math.random() * 1e6);
    const numZeros = Math.round(Math.random()) + 2;

    createTarget(numZeros);
    await Chain.instance.mine(origNonce.current, numZeros, setNonce, setSolution, 0);

    // update timestamp
    minedBlock.current.timestamp = Date.now();

    if (solution <= target) {
      setIsValid(true);
    }
  }

  return (
    <div className="container-fluid">
      <NavbarUI />

      <div id="verified-transaction">
        <BoxItemLineUI
          details={JSON.parse(localStorage.getItem("transactions") as string)}
          title="Verified Transactions"
        />
      </div>

      <div className="row d-flex justify-content-center align-items-center my-5 container-fluid">
        <div className="col-6" id="mine-interactive-area">
          <div id="statistics">
            <Form.Group>
              <h5>Nonce:</h5>
              <Form.Control type="number" defaultValue={origNonce.current} disabled={true} />
            </Form.Group>
            <Form.Group>
              <h5>Current:</h5>
              <Form.Control type="number" defaultValue={nonce} disabled={true} />
            </Form.Group>
            <Form.Group>
              <h5>Target:</h5>
              <Form.Control type="text" defaultValue={target} disabled={true} />
            </Form.Group>
            <Form.Group>
              <h5>Solution:</h5>
              <Form.Control
                type="text"
                style={isValid ? { color: "green" } : { color: "red" }}
                defaultValue={solution}
                disabled={true}
              />
            </Form.Group>
          </div>

          <Button variant="primary" className="btn-block d-block mt-3" onClick={() => handleMine()}>
            <h4>Mine</h4>
          </Button>
        </div>

        <div id="mined-block" className={"col-6 " + (isValid ? "valid-block" : "invalid-block")}>
          {isValid && (
            <Button variant="success" id="mine-add-block">
              +
            </Button>
          )}
          <Form.Group>
            <Form.Label>
              <h5>Index:</h5>
            </Form.Label>{" "}
            <Form.Control type="number" defaultValue={minedBlock.current.index} disabled={true} />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <h5>Timestamp:</h5>
            </Form.Label>
            <Form.Control type="number" defaultValue={minedBlock.current.timestamp} disabled={true} />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <h5>Previous Hash:</h5>
            </Form.Label>
            <Form.Control type="text" defaultValue={Chain.instance.lastBlock.currHash} disabled={true} />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <h5>Current Hash:</h5>
            </Form.Label>
            <Form.Control type="text" defaultValue={isValid ? solution : ""} disabled={true} />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <h5>Merkle Root:</h5>
            </Form.Label>
            <Form.Control type="text" defaultValue={"4h354kdnf380sdf234..."} disabled={true} />
          </Form.Group>
        </div>
      </div>
    </div>
  );
}
