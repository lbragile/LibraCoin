import React, { useState, useEffect, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";

import Statistics from "./Statistics";
import { IAction, IBlock, IState } from "../../typings/AppTypes";

import "./Block.css";
import { digestMessage } from "../../utils/conversion";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import BlockTrans from "./BlockTrans";

export default function Block({ details }: { details: IBlock }): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const [solution, setSolution] = useState<string>("");
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [merkleRoot, setMerkleRoot] = useState<string>(details.merkleRoot);
  const [isValid, setIsValid] = useState<boolean>(details.valid ?? true);
  const [showTrans, setShowTrans] = useState<boolean>(false);

  // update timestamp when solution is mined
  useEffect(() => setTimestamp(Date.now()), [solution]);

  async function updateBlockStatus(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const newRoot = e.target.value;
    const newHash = await digestMessage(details.index + details.prevHash + newRoot);
    setIsValid(newRoot === merkleRoot);
    setTimestamp(Date.now());
    setSolution(newHash);
    setMerkleRoot(newRoot);

    // after updating the block, propagate the changes
    await propagateBlockStatus(newHash, false, newRoot);
  }

  async function propagateBlockStatus(
    prevHash: string,
    skipFirstUpdate: boolean,
    newRoot?: string,
    timestamp = Date.now()
  ): Promise<void> {
    const index = details.index;

    for (let i = index; i < state.chain.length; i++) {
      const merkleRoot = newRoot && i === index ? newRoot : state.chain[i].merkleRoot;
      const currHash = i === index ? prevHash : await digestMessage(i + prevHash + merkleRoot);

      const newBlock = {
        index: i,
        timestamp,
        prevHash: i === index ? details.prevHash : prevHash,
        currHash,
        transactions: state.chain[i].transactions,
        merkleRoot,
        valid: skipFirstUpdate ? i === index : false,
      };

      prevHash = currHash; // next block's prevHash is this block's currHash

      dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { block: newBlock } });
    }
  }

  return (
    <div className="col">
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
            <Form.Control type="number" defaultValue={solution ? timestamp : details.timestamp} disabled={true} />
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
            <Form.Control type="text" defaultValue={solution ? solution : details.currHash} disabled={true} />
          </InputGroup>

          <InputGroup className="my-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Merkle #</InputGroup.Text>
            </InputGroup.Prepend>
            {details.index === 0 ? (
              <Form.Control type="text" defaultValue={""} disabled={true} />
            ) : (
              <React.Fragment>
                <Form.Control
                  type="text"
                  value={merkleRoot}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBlockStatus(e)}
                />
                <InputGroup.Append>
                  <InputGroup.Text className="show-trans-eye" onClick={() => setShowTrans(!showTrans)}>
                    {showTrans ? "🙈" : "🙉"}
                  </InputGroup.Text>
                </InputGroup.Append>
              </React.Fragment>
            )}
          </InputGroup>
        </Form>

        <Statistics
          chain={true}
          solution={solution}
          setSolution={setSolution}
          isValid={isValid}
          setIsValid={setIsValid}
          propagateBlockStatus={propagateBlockStatus}
        />
      </div>

      {showTrans && <BlockTrans block={details} setMerkleRoot={setMerkleRoot} />}
    </div>
  );
}
