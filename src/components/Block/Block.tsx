import React, { useState, useEffect, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";

import Statistics from "./Statistics";
import { AppContext } from "../../context/AppContext";
import { IAction, IBlock, IState, ITransaction } from "../../typings/AppTypes";
import { ACTIONS } from "../../enums/AppDispatchActions";

import { digestMessage } from "../../utils/conversion";
import { calculateMerkleTreeFormation } from "../../utils/merkleTree";
import { propagateBlockStatus } from "../../utils/propagate";

type TChange = "from" | "to" | "message" | "amount";
type TInputChange<T = HTMLInputElement> = React.ChangeEvent<T>;

export default function Block({ block }: { block: IBlock }): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const [solution, setSolution] = useState<string>("");
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [isValid, setIsValid] = useState<boolean>(block.valid ?? true);
  const [showTrans, setShowTrans] = useState<boolean>(block.showTrans ?? false);

  // update timestamp when solution is mined
  useEffect(() => setTimestamp(Date.now()), [solution]);

  async function calculateNewMerkleRoot(newVal: number | string, index: number, type: TChange): Promise<void> {
    const newTrans = JSON.parse(JSON.stringify(block.transactions)); // deep copy

    // update the changed value & signature
    newTrans[index][type] = newVal;
    newTrans[index].signature = await digestMessage(newTrans[index].to + newTrans[index].from + newTrans[index].amount + newTrans[index].message); // prettier-ignore

    // calculate new merkle root and currHash
    const root = await calculateMerkleTreeFormation(newTrans, newTrans);
    const newHash = await digestMessage(block.index + block.prevHash + root);

    await propagateBlockStatus(state, dispatch, block, newHash, false, root, newTrans);
  }

  function handleViewTransactions(): void {
    setShowTrans(!showTrans);
    dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { block: { ...block, showTrans: !showTrans } } });
  }

  return (
    <div className="block flex-column flex-shrink-0">
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
                    {showTrans ? "🙈" : "🙉"}
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

      {showTrans && (
        <div className="row flex-nowrap overflow-auto mx-2">
          {block.transactions.map((transaction: ITransaction, i: number) => {
            return (
              <div className="col-12 mr-2 bg-light border border-dark p-1 rounded" key={`sig:${transaction.signature}`}>
                <Form.Group className="mb-2 text-center">
                  <Form.Control
                    className="text-truncate"
                    type="text"
                    value={transaction.from}
                    onChange={(e: TInputChange) => calculateNewMerkleRoot(e.target.value, i, "from")}
                  />
                  <h3 className="my-0">↓</h3>
                  <Form.Control
                    className="text-truncate"
                    type="text"
                    value={transaction.to}
                    onChange={(e: TInputChange) => calculateNewMerkleRoot(e.target.value, i, "to")}
                  />
                </Form.Group>

                <InputGroup className="mb-2">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Msg</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    as="textarea"
                    value={transaction.message}
                    onChange={(e: TInputChange<HTMLTextAreaElement>) =>
                      calculateNewMerkleRoot(e.target.value, i, "message")
                    }
                  />
                </InputGroup>

                <InputGroup className="mb-2">
                  <Form.Control
                    type="number"
                    value={transaction.amount && parseFloat(transaction.amount + "").toFixed(2)}
                    onChange={(e: TInputChange) => calculateNewMerkleRoot(e.target.value, i, "amount")}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>LC</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>

                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Sig</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control className="text-truncate" type="text" defaultValue={transaction.signature} readOnly />
                </InputGroup>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
