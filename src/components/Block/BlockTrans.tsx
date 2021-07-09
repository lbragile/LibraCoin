import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

import { ACTIONS } from "../../enums/AppDispatchActions";
import { useAppContext } from "../../hooks/useAppContext";
import { StyledInputGroupText } from "../../styles/GlobalStyles";
import { IBlock, ITransaction } from "../../typings/AppTypes";

import { digestMessage } from "../../utils/conversion";
import { calculateMerkleTreeFormation, getMerkleRoot } from "../../utils/merkleTree";

type TChangeType = "from" | "to" | "msg" | "amount";
type TInputChange<T = HTMLInputElement> = React.ChangeEvent<T>;

export default function BlockTrans({ index }: { index: number }): JSX.Element {
  const { state, dispatch } = useAppContext();

  const [transDetails, setTransDetails] = useState<ITransaction[]>(state.chain[index].transactions);

  async function calculateNewMerkleRoot(newVal: number | string, i: number, type: TChangeType): Promise<void> {
    const newTrans: ITransaction[] = [...transDetails];

    // update the changed value & signature
    newTrans[i] = { ...newTrans[i], [type]: newVal };
    const message = newTrans[i].to + newTrans[i].from + newTrans[i].amount + newTrans[i].msg;
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
    <div
      className="row flex-nowrap overflow-auto mx-1 mt-3 p-2 rounded bg-secondary"
      aria-label="Block Transactions Group"
      role="list"
    >
      {transDetails.map((transaction, i) => {
        return (
          <Form
            aria-label="Block Transactions Item"
            role="listitem"
            className={
              (transDetails.length > 1 && i !== transDetails.length - 1 ? "mr-2 " : "") + "col-12 bg-light p-2 rounded"
            }
            key={`sig:${i}`}
          >
            <InputGroup className="mb-2 text-center">
              <Form.Control
                aria-label="Block Transactions From"
                name="btFrom"
                className="text-truncate rounded w-100"
                type="text"
                value={transaction.from}
                onChange={(e: TInputChange) => calculateNewMerkleRoot(e.target.value, i, "from")}
              />
              <h3 className="my-0 w-100">↓</h3>
              <Form.Control
                aria-label="Block Transactions To"
                name="btTo"
                className="text-truncate rounded w-100"
                type="text"
                value={transaction.to}
                onChange={(e: TInputChange) => calculateNewMerkleRoot(e.target.value, i, "to")}
              />
            </InputGroup>

            <InputGroup className="mb-2">
              <InputGroup.Prepend>
                <StyledInputGroupText>Msg</StyledInputGroupText>
              </InputGroup.Prepend>
              <Form.Control
                aria-label="Block Transactions Message"
                name="btMsg"
                as="textarea"
                rows={3}
                value={transaction.msg}
                onChange={(e: TInputChange<HTMLTextAreaElement>) => calculateNewMerkleRoot(e.target.value, i, "msg")}
              />
            </InputGroup>

            <InputGroup className="mb-2">
              <Form.Control
                aria-label="Block Transactions Amount"
                name="btAmount"
                type="number"
                value={transaction.amount}
                onChange={(e: TInputChange) => calculateNewMerkleRoot(e.target.value, i, "amount")}
              />
              <InputGroup.Append>
                <StyledInputGroupText>LC</StyledInputGroupText>
              </InputGroup.Append>
            </InputGroup>

            <InputGroup>
              <InputGroup.Prepend>
                <StyledInputGroupText>Sig</StyledInputGroupText>
              </InputGroup.Prepend>
              <Form.Control
                aria-label="Block Transactions Signature"
                name="btSignature"
                className="text-truncate"
                type="text"
                value={transaction.signature}
                readOnly
              />
            </InputGroup>
          </Form>
        );
      })}
    </div>
  );
}
