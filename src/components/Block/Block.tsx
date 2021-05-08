import React, { useState, useEffect, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";

import Statistics from "./Statistics";
import { IAction, IBlock, IState, ITransaction } from "../../typings/AppTypes";

import "./Block.css";
import { digestMessage } from "../../utils/conversion";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { calculateMerkleTreeFormation } from "../../utils/merkleTree";

type TChange = "from" | "to" | "message" | "amount";

export default function Block({ details }: { details: IBlock }): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const [solution, setSolution] = useState<string>("");
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [merkleRoot, setMerkleRoot] = useState<string>(details.merkleRoot);
  const [isValid, setIsValid] = useState<boolean>(details.valid ?? true);
  const [showTrans, setShowTrans] = useState<boolean>(false);
  const [trans, setTrans] = useState<ITransaction[]>(details.transactions);

  // update timestamp when solution is mined
  useEffect(() => setTimestamp(Date.now()), [solution]);

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
        valid: skipFirstUpdate ? i === index : false
      };

      prevHash = currHash; // next block's prevHash is this block's currHash

      dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { block: newBlock } });
    }
  }

  async function calculateNewMerkleRoot(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: TChange
  ): Promise<void> {
    const newVal = e.target.value;
    const newTrans = JSON.parse(JSON.stringify(trans)); // deep copy

    // update the changed value & signature
    newTrans[index] = { ...newTrans[index], [type]: newVal };
    newTrans[index].signature = await digestMessage(newTrans[index].to + newTrans[index].from + newTrans[index].amount + newTrans[index].message); // prettier-ignore

    // calculate new merkle root and currHash
    const root = await calculateMerkleTreeFormation(newTrans, newTrans);
    const newHash = await digestMessage(details.index + details.prevHash + root);

    setTrans(newTrans);
    setMerkleRoot(root);
    setSolution(newHash);

    await propagateBlockStatus(newHash, false, root);
  }

  return (
    <div className="flex-column">
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
                <Form.Control type="text" defaultValue={merkleRoot} disabled={true} />
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

      {showTrans && (
        <div>
          {trans.map((transaction: ITransaction, i: number) => {
            return (
              <div className="col-11 mx-auto mb-2 bg-light border border-dark p-1 rounded" key={Math.random()}>
                <Form.Group className="mb-2 text-center">
                  <Form.Control
                    type="text"
                    value={transaction.from}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => calculateNewMerkleRoot(e, i, "from")}
                  />
                  <h3 className="my-0">↓</h3>
                  <Form.Control
                    type="text"
                    value={transaction.to}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => calculateNewMerkleRoot(e, i, "to")}
                  />
                </Form.Group>

                <InputGroup className="mb-2">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Msg</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    as="textarea"
                    value={transaction.message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => calculateNewMerkleRoot(e, i, "message")}
                  />
                </InputGroup>

                <InputGroup className="mb-2">
                  <Form.Control
                    type="number"
                    value={transaction.amount && parseFloat(transaction.amount + "").toFixed(2)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => calculateNewMerkleRoot(e, i, "amount")}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>LC</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>

                <InputGroup className="mb-2">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Sig</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type="text" defaultValue={transaction.signature} disabled={true} />
                </InputGroup>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
