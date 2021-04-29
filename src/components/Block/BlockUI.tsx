import React, { useState, useEffect } from "react";

import { Button, Form } from "react-bootstrap";
import { Chain } from "../Chain/chain_class";
import StatisticsUI from "./StatisticsUI";

import "./Block.css";
import { Block } from "./block_class";

export default function BlockUI({
  details,
  startValid,
  setBlockchain,
}: {
  startValid: boolean;
  details?: Block;
  setBlockchain?: (arg: Block[]) => void;
}): JSX.Element {
  const [solution, setSolution] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(startValid);
  const [showBtn, setShowBtn] = useState<boolean>(true);
  const [timestamp, setTimestamp] = useState<number>(details ? details.timestamp : Chain.instance.lastBlock.timestamp);

  useEffect(() => {
    setTimestamp(Date.now());
  }, [solution]);

  function handleAddBlock() {
    Chain.instance.addBlock(solution, []);
    setShowBtn(false);
  }

  async function handleTransactionInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (details) {
      const og_hash = Chain.instance.blockChain[details.index].currHash;

      const hash = await Chain.instance.digestMessage(
        Chain.instance.blockChain[details.index].prevHash + e.target.value
      );
      Chain.instance.blockChain[details.index].currHash = hash;

      // !TODO will need to update the transactions field once it is complete (merkle root string)
      // Chain.instance.blockChain[details.index].transactions = [e.target.value];

      // persist new blockchain
      localStorage.setItem("chain", JSON.stringify(Chain.instance.blockChain));

      // re-render the new calculated hash
      setSolution(hash);
      setIsValid(hash === og_hash && hash.slice(0, 2) === "00");
      setBlockchain && setBlockchain(Chain.instance.blockChain);
    }
  }

  return (
    <React.Fragment>
      {!details && (
        <StatisticsUI
          chain={false}
          setShowBtn={setShowBtn}
          solution={solution}
          setSolution={setSolution}
          isValid={isValid}
          setIsValid={setIsValid}
        />
      )}

      <div className={"block " + (details ? "col-12 " : "") + (isValid ? "valid-block" : "invalid-block")}>
        <Form.Group>
          <Form.Label>
            <h5>Index:</h5>
          </Form.Label>
          <Form.Control
            type="number"
            defaultValue={!details ? Chain.instance.lastBlock.index + 1 : details.index}
            disabled={true}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h5>Timestamp:</h5>
          </Form.Label>
          <Form.Control type="number" value={!details || solution ? timestamp : details.timestamp} disabled={true} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h5>Previous Hash:</h5>
          </Form.Label>
          <Form.Control
            type="text"
            defaultValue={!details ? Chain.instance.lastBlock.currHash : details.prevHash}
            disabled={true}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h5>Current Hash:</h5>
          </Form.Label>
          <Form.Control type="text" value={!details || solution ? solution : details.currHash} disabled={true} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h5>Merkle Root:</h5>
          </Form.Label>
          <Form.Control
            type="text"
            value={details?.index === 0 ? "" : "abc"}
            disabled={details && details.index === 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTransactionInfoChange(e)}
          />
        </Form.Group>

        {!details && isValid && showBtn && (
          <Button variant="success" block onClick={() => handleAddBlock()}>
            <h3 className="my-0 font-weight-bold">+</h3>
          </Button>
        )}

        {details && (
          <StatisticsUI
            chain={true}
            index={details.index}
            setShowBtn={setShowBtn}
            solution={solution}
            setSolution={setSolution}
            isValid={isValid}
            setIsValid={setIsValid}
          />
        )}
      </div>
    </React.Fragment>
  );
}
