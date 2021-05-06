import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { IBlock, ITransaction } from "../../typings/AppTypes";
import { digestMessage } from "../../utils/conversion";
import { calculateMerkleTreeFormation } from "../../utils/merkleTree";

import "./Block.css";

type TChange = "from" | "to" | "message" | "amount";

export default function BlockTrans({
  block,
  setMerkleRoot,
}: {
  block: IBlock;
  setMerkleRoot: (arg: string) => void;
}): JSX.Element {
  const [trans, setTrans] = useState<ITransaction[]>(block.transactions);

  async function calculateNewMerkleRoot(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: TChange
  ): Promise<void> {
    const newVal = e.target.value;
    const newTrans = JSON.parse(JSON.stringify(trans)); // deep copy

    // update the changed value
    newTrans[index] = { ...newTrans[index], [type]: newVal };

    // new signature
    newTrans[index].signature = await digestMessage(newTrans[index].to + newTrans[index].from + newTrans[index].amount + newTrans[index].message); // prettier-ignore
    setTrans(newTrans);

    const root = await calculateMerkleTreeFormation(newTrans, newTrans);
    setMerkleRoot(root);

    // TODO: persist changes, and propagate details to blocks in Block.tsx
  }

  return (
    <div className="bg-dark col p-1 rounded">
      {trans.map((transaction: ITransaction, i: number) => {
        return (
          <div className="bg-light p-2 m-1 rounded" key={Math.random()}>
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
  );
}
