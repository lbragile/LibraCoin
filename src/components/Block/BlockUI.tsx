import React, { useState, useEffect } from "react";

import { Button, Form } from "react-bootstrap";
import { Chain } from "../Chain/chain_class";
import StatisticsUI from "../Mine/StatisticsUI";

import "./Block.css";
import { Block } from "./block_class";

export default function BlockUI({ details }: { details?: Block }): JSX.Element {
  const [solution, setSolution] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(!!details);
  const [showBtn, setShowBtn] = useState<boolean>(true);
  const [timestamp, setTimestamp] = useState<number>(details ? details.timestamp : Chain.instance.lastBlock.timestamp);

  useEffect(() => {
    setTimestamp(Date.now());
  }, [solution]);

  function handleAddBlock() {
    Chain.instance.addBlock(solution, []);
    setShowBtn(false);
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
          <Form.Control type="text" defaultValue={"abc"} disabled={true} />
        </Form.Group>

        {!details && isValid && showBtn && (
          <Button variant="success" block onClick={() => handleAddBlock()}>
            <h3 className="my-0 font-weight-bold">+</h3>
          </Button>
        )}

        {details && (
          <StatisticsUI
            chain={true}
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
