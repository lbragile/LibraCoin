import React, { useRef, useState } from "react";
import NavbarUI from "../Navbar/NavbarUI";

import "./Mine.css";
import { Button, Form } from "react-bootstrap";
import BoxItemLineUI from "../BoxItemLineUI/BoxItemLineUI";
import { Chain } from "../Chain/chain_class";

export default function MineUI(): JSX.Element {
  const [nonce, setNonce] = useState<number>();
  const [solution, setSolution] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showBtn, setShowBtn] = useState<boolean>(true);
  const origNonce = useRef<number>();

  async function createTarget(numZeros: number): Promise<string> {
    let targetHash = await Chain.instance.digestMessage(Chain.instance.randomHash(20));

    // replace leading bits with zeros
    const re = new RegExp(`^.{0,${numZeros}}`, "g");
    const zerosStr = Array(numZeros).fill("0").join("");
    targetHash = targetHash.replace(re, zerosStr);
    setTarget(targetHash);

    return targetHash;
  }

  async function handleMine() {
    setShowBtn(true);
    setIsValid(false);
    origNonce.current = Math.round(Math.random() * 1e6);
    const numZeros = Math.round(Math.random()) + 2;
    const targetHash = await createTarget(numZeros);
    const solutionHash = await Chain.instance.mine(origNonce.current, numZeros, setNonce, setSolution);

    if (solutionHash <= targetHash) {
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
          {isValid && showBtn && (
            <Button
              variant="success"
              id="mine-add-block"
              onClick={() => {
                Chain.instance.addBlock(solution, []);
                setShowBtn(false);
              }}
            >
              +
            </Button>
          )}
          <Form.Group>
            <Form.Label>
              <h5>Index:</h5>
            </Form.Label>{" "}
            <Form.Control type="number" defaultValue={solution && Chain.instance.lastBlock.index + 1} disabled={true} />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <h5>Timestamp:</h5>
            </Form.Label>
            <Form.Control type="number" defaultValue={solution ? Date.now() : ""} disabled={true} />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <h5>Previous Hash:</h5>
            </Form.Label>
            <Form.Control type="text" defaultValue={solution && Chain.instance.lastBlock.currHash} disabled={true} />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <h5>Current Hash:</h5>
            </Form.Label>
            <Form.Control type="text" defaultValue={solution} disabled={true} />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <h5>Merkle Root:</h5>
            </Form.Label>
            <Form.Control type="text" defaultValue={"abc"} disabled={true} />
          </Form.Group>
        </div>
      </div>
    </div>
  );
}
