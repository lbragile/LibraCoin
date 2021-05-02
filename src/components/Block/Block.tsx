import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";

import Statistics from "./Statistics";
import { IBlock } from "../../typings/AppTypes";

import "./Block.css";

export default function Block({ details }: { details: IBlock }): JSX.Element {
  // const { state } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const [solution, setSolution] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [, setTimestamp] = useState<number>(Date.now());

  // update timestamp when solution is mined
  useEffect(() => setTimestamp(Date.now()), [solution]);

  return (
    <div className={"block my-3 mx-1 p-2 rounded " + (isValid ? "valid-block" : "invalid-block")}>
      <Form>
        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Index</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="number" defaultValue={details.index} disabled={true} />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Timestamp</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="number" defaultValue={details.timestamp} disabled={true} />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Previous #</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="text" defaultValue={details.prevHash} disabled={true} />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Current #</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="text" defaultValue={details.currHash} disabled={true} />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Merkle #</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="text" defaultValue={"abc"} />
        </InputGroup>
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
