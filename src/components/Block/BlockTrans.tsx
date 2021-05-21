import React, { useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";

import { AppContext } from "../../context/AppContext";
import { IAction, IBlock, IState, ITransaction } from "../../typings/AppTypes";

import { digestMessage } from "../../utils/conversion";
import { calculateMerkleTreeFormation } from "../../utils/merkleTree";
import { propagateBlockStatus } from "../../utils/propagate";

type TChange = "from" | "to" | "message" | "amount";
type TInputChange<T = HTMLInputElement> = React.ChangeEvent<T>;

export default function BlockTrans({ block }: { block: IBlock }): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

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

  return (
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
  );
}
