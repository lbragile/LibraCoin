import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { useAppContext } from "../../hooks/useAppContext";
import { ITransaction } from "../../typings/AppTypes";
import { calculateMerkleTreeFormation, getMerkleRoot } from "../../utils/merkleTree";

import "./Transaction.scss";

export default function TransactionItems(): JSX.Element {
  const { state, dispatch } = useAppContext();

  async function selectTransaction(transaction: ITransaction): Promise<void> {
    let selectedTrans: ITransaction[] = JSON.parse(JSON.stringify(state.selectedTrans));
    const signatures = selectedTrans.map((x) => x.signature);
    const included = signatures.includes(transaction.signature);

    if (selectedTrans.length < 4 || included) {
      // if just selected - push onto stack, else remove it
      // adjust backgrounds according to selection/deselection
      if (!included) {
        selectedTrans.push(transaction);
      } else {
        selectedTrans = selectedTrans.filter((x) => x.signature !== transaction.signature);
      }

      const newTree = await calculateMerkleTreeFormation(state.verifiedTrans, selectedTrans);
      const newPreview = {
        ...state.preview,
        merkleRoot: getMerkleRoot(newTree),
        valid: false
      };

      dispatch({ type: ACTIONS.UPDATE_SELECTED_TRANS, payload: { selectedTrans } });
      dispatch({ type: ACTIONS.UPDATE_PREVIEW, payload: { preview: newPreview } });
    } else {
      alert("You can mine at most 4 transactions at a time!");
    }
  }

  return (
    <div className="container-fluid">
      <h3 aria-label="Title" className="font-weight-bold">
        Verified Transactions
      </h3>
      <div className="trans-list row flex-nowrap overflow-auto bg-dark mx-1 px-2 rounded">
        {state.verifiedTrans.map((transaction) => {
          return (
            <Form
              aria-label="Transaction Information"
              className={
                "trans-item " +
                (state.selectedTrans.map((x) => x.signature).includes(transaction.signature) ? "selected" : "not-selected") // prettier-ignore
              }
              onClick={() => selectTransaction(transaction)}
              key={`sig:${transaction.signature}`}
            >
              <Form.Group className="mb-2 text-center">
                <Form.Control
                  aria-label="Transaction From"
                  name="from"
                  className="text-truncate"
                  type="text"
                  defaultValue={transaction.from}
                  readOnly
                />
                <h3 className="my-0">↓</h3>
                <Form.Control
                  aria-label="Transaction To"
                  name="to"
                  className="text-truncate"
                  type="text"
                  defaultValue={transaction.to}
                  readOnly
                />
              </Form.Group>

              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>Msg</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  aria-label="Transaction Message"
                  name="msg"
                  as="textarea"
                  defaultValue={transaction.msg}
                  readOnly
                />
              </InputGroup>

              <InputGroup className="mb-2">
                <Form.Control
                  aria-label="Transaction Amount"
                  name="amount"
                  type="number"
                  defaultValue={transaction.amount}
                  disabled
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
                  aria-label="Transaction Signature"
                  name="signature"
                  className="text-truncate"
                  type="text"
                  defaultValue={transaction.signature}
                  readOnly
                />
              </InputGroup>
            </Form>
          );
        })}
      </div>
    </div>
  );
}
