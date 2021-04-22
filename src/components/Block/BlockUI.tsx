import React, { useState } from "react";

import { Button, Form } from "react-bootstrap";
import { Chain } from "../Chain/chain_class";

import "./Block.css";
import { Block } from "./block_class";

export default function BlockUI({ block, useChain }: { block: Block; useChain: boolean }): JSX.Element {
  const [solution, setSolution] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [nonce, setNonce] = useState<number>();
  const [valid, setValid] = useState<boolean>(true);
  const [origBlock, setOrigBlock] = useState<Block>(block);

  async function handleMineBlockChain() {
    const nonce = Math.round(Math.random() * 1e6);
    const leadingZeros = Math.round(Math.random()) + 2;
    const targetHash = await Chain.instance.createTarget(leadingZeros);
    setTarget(targetHash);
    const solutionHash = await Chain.instance.mine(nonce, leadingZeros, setNonce, setSolution);

    if (solutionHash <= targetHash) {
      const currentBlock = JSON.parse(JSON.stringify(origBlock));
      currentBlock.currHash = solutionHash;
      setOrigBlock(currentBlock);
      setValid(true);
    }
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const currentBlock = JSON.parse(JSON.stringify(origBlock));
    const message =
      currentBlock.index.toString() + currentBlock.timestamp.toString() + currentBlock.prevHash + e.target.value;
    currentBlock.currHash = await Chain.instance.digestMessage(message);
    setOrigBlock(currentBlock);
    setValid(false);
  }

  return (
    <div className="block-and-chain">
      <Form className={"block-background " + (valid ? "valid-block" : "invalid-block")}>
        <Form.Group controlId="index-indicator">
          <Form.Label>
            <h5>Index:</h5>
          </Form.Label>
          <Form.Control type="number" defaultValue={origBlock.index} disabled={true} />
        </Form.Group>

        <Form.Group controlId="index-indicator">
          <Form.Label>
            <h5>Timestamp:</h5>
          </Form.Label>
          <Form.Control type="number" defaultValue={origBlock.timestamp} disabled={true} />
        </Form.Group>

        <Form.Group controlId="prevHash-indicator">
          <Form.Label>
            <h5>Previous Hash:</h5>
          </Form.Label>
          <Form.Control type="text" defaultValue={origBlock.prevHash} disabled={true} />
        </Form.Group>

        <Form.Group controlId="prevHash-indicator">
          <Form.Label>
            <h5>Current Hash:</h5>
          </Form.Label>
          <Form.Control type="text" value={origBlock.currHash} disabled={true} />
        </Form.Group>

        <Form.Group controlId="prevHash-indicator">
          <Form.Label>
            <h5>Merkle Root:</h5>
          </Form.Label>
          <Form.Control
            type="text"
            defaultValue={JSON.stringify(origBlock.transactions)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
          />
        </Form.Group>

        {useChain && (
          <React.Fragment>
            <Button variant="primary" block disabled={valid} onClick={() => handleMineBlockChain()}>
              Mine
            </Button>
            <div className="mt-3">
              <Form.Group>
                <Form.Label>
                  <h5>Nonce:</h5>
                </Form.Label>
                <Form.Control type="text" value={nonce} disabled={true} />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  <h5>Target:</h5>
                </Form.Label>
                <Form.Control type="text" value={target} disabled={true} />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  <h5>Solution:</h5>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={solution}
                  style={valid ? { color: "green" } : { color: "red" }}
                  disabled={true}
                />
              </Form.Group>
            </div>
          </React.Fragment>
        )}
      </Form>

      {useChain && <div className="chain-link">🔗</div>}
    </div>
  );
}
