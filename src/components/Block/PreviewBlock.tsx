import React, { useRef, useState, useEffect, useContext } from "react";
import { Button, Form } from "react-bootstrap";

import Statistics from "./Statistics";

import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import "./Block.css";
import { ACTIONS } from "../../enums/AppDispatchActions";

export default function PreviewBlock(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const nextIndex = useRef(state.chain[state.chain.length - 1].index + 1);
  const prevBlockHash = useRef(state.chain[state.chain.length - 1].currHash);

  const [solution, setSolution] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showBtn, setShowBtn] = useState<boolean>(true);
  const [timestamp, setTimestamp] = useState<number>(Date.now());

  // update timestamp & currentHash when solution is mined
  useEffect(() => setTimestamp(Date.now()), [solution]);

  function handleAddBlock() {
    const block = {
      index: nextIndex.current,
      prevHash: prevBlockHash.current,
      currHash: solution,
      transactions: [],
      timestamp,
    };

    dispatch({ type: ACTIONS.ADD_BLOCK, payload: { block } });
    setShowBtn(false);
  }

  return (
    <div className="row d-flex justify-content-center my-3">
      <Statistics
        chain={false}
        solution={solution}
        setSolution={setSolution}
        isValid={isValid}
        setIsValid={setIsValid}
      />

      <Form className={"block col-xl-5 " + (isValid ? "valid-block" : "invalid-block")}>
        <Form.Group>
          <Form.Label>
            <h5>Index:</h5>
          </Form.Label>
          <Form.Control type="number" defaultValue={nextIndex.current} disabled={true} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h5>Timestamp:</h5>
          </Form.Label>
          <Form.Control type="number" value={timestamp} disabled={true} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h5>Previous Hash:</h5>
          </Form.Label>
          <Form.Control type="text" defaultValue={prevBlockHash.current} disabled={true} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h5>Current Hash:</h5>
          </Form.Label>
          <Form.Control type="text" value={solution} disabled={true} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h5>Merkle Root:</h5>
          </Form.Label>
          <Form.Control type="text" value={"abc"} disabled={true} />
        </Form.Group>

        {isValid && showBtn && (
          <Button variant="success" block onClick={() => handleAddBlock()}>
            <h3 className="my-0 font-weight-bold">+</h3>
          </Button>
        )}
      </Form>
    </div>
  );
}
