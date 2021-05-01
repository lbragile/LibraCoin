import React, { useRef, useState, useEffect, useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

import Statistics from "./Statistics";
import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { calculateMerkleTreeFormation, drawTreeDiagramOnCanvas, getMerkleRoot } from "../../utils/merkleTree";

import "./Block.css";

export default function PreviewBlock(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const nextIndex = useRef<number>(state.chain[state.chain.length - 1].index + 1);
  const prevBlockHash = useRef<string>(state.chain[state.chain.length - 1].currHash);
  const treeCanvas = useRef<HTMLCanvasElement | null>(null);

  const [solution, setSolution] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showBtn, setShowBtn] = useState<boolean>(true);
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [merkleTree, setMerkleTree] = useState<string[][]>([[""]]);

  useEffect(() => {
    calculateMerkleTreeFormation(state.verifiedTrans, state.selectedTrans, setMerkleTree);
  }, [state.selectedTrans]);

  // draw tree in canvas
  useEffect(() => {
    drawTreeDiagramOnCanvas(merkleTree, treeCanvas.current);
  }, [merkleTree]);

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
    localStorage.setItem("chain", JSON.stringify([...state.chain, block]));
    setShowBtn(false);
    setIsValid(false);
  }

  return (
    <div className="container-fluid row d-flex justify-content-center mx-auto my-3">
      <div className="text-center overflow-auto w-90 h-20 mb-2">
        <h4 className="font-weight-bold">Merkle Tree Visualization</h4>
        <canvas ref={treeCanvas} className="border border-dark" width={1650} />
      </div>

      <Statistics
        chain={false}
        solution={solution}
        setSolution={setSolution}
        isValid={isValid}
        setIsValid={setIsValid}
      />

      <Form className={"block col-10 col-lg-5 my-4 my-lg-0 pb-2 " + (isValid ? "valid-block" : "invalid-block")}>
        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Index</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="number" defaultValue={nextIndex.current} disabled={true} />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Timestamp</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="number" defaultValue={timestamp} disabled={true} />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Previous #</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="text" defaultValue={prevBlockHash.current} disabled={true} />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Current #</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="text" defaultValue={solution} disabled={true} />
        </InputGroup>

        <InputGroup className="my-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Merkle #</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="text" defaultValue={getMerkleRoot(merkleTree)} disabled={true} />
        </InputGroup>

        {isValid && showBtn && (
          <Button variant="success" block onClick={() => handleAddBlock()}>
            <h3 className="my-0 font-weight-bold">+</h3>
          </Button>
        )}
      </Form>
    </div>
  );
}
