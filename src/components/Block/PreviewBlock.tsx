import React, { useRef, useState, useEffect, useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

import Statistics from "./Statistics";
import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { calculateMerkleTreeFormation, drawTreeDiagramOnCanvas, getMerkleRoot } from "../../utils/merkleTree";

import "./Block.scss";

export default function PreviewBlock(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const treeCanvas = useRef<HTMLCanvasElement | null>(null);

  const [solution, setSolution] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [merkleTree, setMerkleTree] = useState<string[][]>([[""]]);
  const [index, setIndex] = useState<number>(state.chain[state.chain.length - 1].index + 1);
  const [prevHash, setPrevHash] = useState<string>(state.chain[state.chain.length - 1].currHash);

  useEffect(() => {
    calculateMerkleTreeFormation(state.verifiedTrans, state.selectedTrans, setMerkleTree);
    setIsValid(false);
  }, [state.selectedTrans, state.verifiedTrans]);

  // draw tree in canvas
  useEffect(() => {
    drawTreeDiagramOnCanvas(merkleTree, treeCanvas.current, state.selectedTrans);
  }, [merkleTree, state.selectedTrans]);

  // update timestamp & currentHash when solution is mined
  useEffect(() => setTimestamp(Date.now()), [solution]);

  function handleAddBlock() {
    const block = {
      index,
      prevHash,
      currHash: solution,
      transactions: state.selectedTrans,
      timestamp,
      merkleRoot: getMerkleRoot(merkleTree),
      valid: state.chain[index - 1].valid, // validity depends on previous block
      showTrans: false
    };

    // add the block, update verified transactions, clear selected transactions
    dispatch({ type: ACTIONS.ADD_BLOCK, payload: { block } });
    dispatch({ type: ACTIONS.UPDATE_VERIFIED_TRANS });
    dispatch({ type: ACTIONS.UPDATE_SELECTED_TRANS, payload: { selectedTrans: [] } });

    // update preview details
    setIsValid(false);
    setIndex(index + 1);
    setPrevHash(solution);
    setSolution("");
    setTimestamp(Date.now());
  }

  return (
    <div className="container-fluid row d-flex justify-content-center mx-auto my-3">
      <div className="mb-2 d-none d-lg-block">
        <h4 className="font-weight-bold text-center">Merkle Tree Visualization</h4>
        <canvas ref={treeCanvas} className="border border-dark rounded" width={window.outerWidth * 0.7} />
      </div>

      <Statistics
        chain={false}
        solution={solution}
        setSolution={setSolution}
        isValid={isValid}
        setIsValid={setIsValid}
      />

      <Form className={"col-10 col-lg-5 my-4 my-lg-0 pb-2 px-2 rounded " + (isValid ? "valid-block" : "invalid-block")}>
        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Index</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="number" value={index} disabled />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Timestamp</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="number" value={timestamp} disabled />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Previous #</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control className="text-truncate" type="text" value={prevHash} readOnly />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Current #</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control className="text-truncate" type="text" value={solution} readOnly />
        </InputGroup>

        <InputGroup className="mt-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Merkle #</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control className="text-truncate" type="text" value={getMerkleRoot(merkleTree)} readOnly />
        </InputGroup>

        {isValid && (
          <Button className="mt-2" variant="success" block onClick={() => handleAddBlock()}>
            <h4 className="my-0 font-weight-bold">Add Block</h4>
          </Button>
        )}
      </Form>
    </div>
  );
}
