import React, { useContext, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, IBlock, IState, ITransaction } from "../../typings/AppTypes";

import { digestMessage } from "../../utils/conversion";
import { calculateMerkleTreeFormation, getMerkleRoot } from "../../utils/merkleTree";

type TChangeType = "from" | "to" | "message" | "amount";
type TInputChange<T = HTMLInputElement> = React.ChangeEvent<T>;

export default function BlockTrans({ index }: { index: number }): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const [transDetails, setTransDetails] = useState<ITransaction[]>(state.chain[index].transactions);

  async function calculateNewMerkleRoot(newVal: number | string, i: number, type: TChangeType): Promise<void> {
    const newTrans: ITransaction[] = JSON.parse(JSON.stringify(transDetails)); // deep copy

    // update the changed value & signature
    newTrans[i] = { ...newTrans[i], [type]: newVal };
    const message = newTrans[i].to + newTrans[i].from + newTrans[i].amount + newTrans[i].message;
    newTrans[i].signature = await digestMessage(message);
    setTransDetails(newTrans);

    // calculate new merkle root
    const newTree = await calculateMerkleTreeFormation(newTrans, newTrans);
    const newRoot = getMerkleRoot(newTree);

    // propagate changes to next blocks
    const newBlocks: IBlock[] = [];
    const timestamp = Date.now();
    let prevHash = state.chain[index].prevHash;
    let currHash = "";
    for (let i = index; i < state.chain.length; i++) {
      const transactions = i === index ? newTrans : state.chain[i].transactions;
      const merkleRoot = i === index ? newRoot : state.chain[i].merkleRoot;
      currHash = await digestMessage(i + prevHash + merkleRoot);
      newBlocks.push({ ...state.chain[i], timestamp, prevHash, currHash, transactions, merkleRoot, valid: false });

      prevHash = currHash; // next block's prevHash is this block's currHash
    }

    dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { block: newBlocks } });
  }

  return (
    <div className="row flex-nowrap overflow-auto mx-1 p-2 rounded bg-dark">
      {transDetails.map((transaction, i) => {
        return (
          <div
            className={
              (transDetails.length > 1 && i !== transDetails.length - 1 ? "mr-2 " : "") +
              "col-12 bg-light border border-dark p-1 rounded"
            }
            key={`sig:${i}`}
          >
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
                rows={3}
                value={transaction.message}
                onChange={(e: TInputChange<HTMLTextAreaElement>) =>
                  calculateNewMerkleRoot(e.target.value, i, "message")
                }
              />
            </InputGroup>

            <InputGroup className="mb-2">
              <Form.Control
                type="number"
                value={transaction.amount ?? 0}
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
              <Form.Control
                key={transaction.signature}
                className="text-truncate"
                type="text"
                defaultValue={transaction.signature}
                readOnly
              />
            </InputGroup>
          </div>
        );
      })}
    </div>
  );
}
