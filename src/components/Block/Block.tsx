import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

import Statistics from "./Statistics";
import { IBlock } from "../../typings/AppTypes";

import "./Block.css";

export default function Block({ details }: { details: IBlock }): JSX.Element {
  const [solution, setSolution] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [timestamp, setTimestamp] = useState<number>(Date.now());

  // update timestamp when solution is mined
  useEffect(() => setTimestamp(Date.now()), [solution]);

  return (
    <div
      className={
        "d-flex flex-column justify-content-center my-3 p-2 rounded " + (isValid ? "valid-block" : "invalid-block")
      }
    >
      <Form className="block col-12">
        <Form.Group>
          <Form.Label>
            <h5>Index:</h5>
          </Form.Label>
          <Form.Control type="number" defaultValue={details.index} disabled={true} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h5>Timestamp:</h5>
          </Form.Label>
          <Form.Control type="number" value={details.timestamp} disabled={true} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h5>Previous Hash:</h5>
          </Form.Label>
          <Form.Control type="text" defaultValue={details.prevHash} disabled={true} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h5>Current Hash:</h5>
          </Form.Label>
          <Form.Control type="text" value={details.currHash} disabled={true} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h5>Merkle Root:</h5>
          </Form.Label>
          <Form.Control type="text" value={"abc"} disabled={true} />
        </Form.Group>
      </Form>

      <Statistics
        chain={true}
        solution={solution}
        setSolution={setSolution}
        isValid={isValid}
        setIsValid={setIsValid}
      />
    </div>
  );
}
