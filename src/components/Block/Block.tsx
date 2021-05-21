import React, { useState, useEffect, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";

import Statistics from "./Statistics";
import { IAction, IBlock } from "../../typings/AppTypes";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";

export default function Block({ block }: { block: IBlock }): JSX.Element {
  const { dispatch } = useContext(AppContext) as { dispatch: React.Dispatch<IAction> };

  const [solution, setSolution] = useState<string>("");
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [isValid, setIsValid] = useState<boolean>(block.valid ?? true);

  // update timestamp when solution is mined
  useEffect(() => setTimestamp(Date.now()), [solution]);

  function handleViewTransactions(): void {
    dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { block: { ...block, showTrans: !block.showTrans } } });
  }

  return (
    <div className="flex-column flex-shrink-0">
      <div className={"my-3 mx-1 p-2 rounded " + (isValid ? "valid-block" : "invalid-block")}>
        <Form>
          <InputGroup className="my-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Index</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="number" defaultValue={block.index} disabled />
          </InputGroup>

          <InputGroup className="my-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Timestamp</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="number" defaultValue={solution ? timestamp : block.timestamp} disabled />
          </InputGroup>

          <InputGroup className="my-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Previous #</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control className="text-truncate" type="text" defaultValue={block.prevHash} readOnly />
          </InputGroup>

          <InputGroup className="my-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Current #</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              className="text-truncate"
              type="text"
              defaultValue={solution ? solution : block.currHash}
              readOnly
            />
          </InputGroup>

          <InputGroup className="my-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Merkle #</InputGroup.Text>
            </InputGroup.Prepend>
            {block.index === 0 ? (
              <Form.Control type="text" defaultValue={""} disabled />
            ) : (
              <React.Fragment>
                <Form.Control className="text-truncate" type="text" defaultValue={block.merkleRoot} readOnly />
                <InputGroup.Append>
                  <InputGroup.Text className="show-trans-eye" onClick={() => handleViewTransactions()}>
                    {block.showTrans ? "🙈" : "🙉"}
                  </InputGroup.Text>
                </InputGroup.Append>
              </React.Fragment>
            )}
          </InputGroup>
        </Form>

        <Statistics
          chain={true}
          block={block}
          solution={solution}
          setSolution={setSolution}
          isValid={isValid}
          setIsValid={setIsValid}
        />
      </div>
    </div>
  );
}
