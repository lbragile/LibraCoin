import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";

import Statistics from "./Statistics";
import { IBlock } from "../../typings/AppTypes";

import "./Block.css";
import { calculateMerkleTreeFormation } from "../../utils/merkleTree";
import { digestMessage } from "../../utils/conversion";

export default function Block({ details }: { details: IBlock }): JSX.Element {
  // const { state } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const [solution, setSolution] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [merkleRoot, setMerkleRoot] = useState<string>("");

  // update timestamp when solution is mined
  useEffect(() => setTimestamp(Date.now()), [solution]);

  useEffect(() => {
    (async () => setMerkleRoot(await calculateMerkleTreeFormation(details.transactions, details.transactions)))();
  }, []);

  async function updateBlockStatus(e: React.ChangeEvent<HTMLInputElement>) {
    const newTime = Date.now();
    const message = details.index + newTime + details.prevHash + solution + e.target.value;
    const newRoot = e.target.value;
    setIsValid(newRoot === merkleRoot);
    setTimestamp(newTime);
    setSolution(await digestMessage(message));
    setMerkleRoot(newRoot);
  }

  return (
    <div className={"block my-3 mx-1 p-2 rounded " + (isValid ? "valid-block" : "invalid-block")}>
      <Form>
        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Index</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="number" value={details.index} disabled={true} />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Timestamp</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="number" value={solution ? timestamp : details.timestamp} disabled={true} />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Previous #</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="text" value={details.prevHash} disabled={true} />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Current #</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="text" value={solution ? solution : details.currHash} disabled={true} />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Merkle #</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="text"
            value={merkleRoot}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBlockStatus(e)}
          />
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
