import React, { useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, IState, ITransaction } from "../../typings/AppTypes";

import "./Transaction.css";

export default function TransactionItems(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  function selectTransaction(transaction: ITransaction): void {
    let selectedTrans: ITransaction[] = JSON.parse(JSON.stringify(state)).selectedTrans;
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

      dispatch({ type: ACTIONS.UPDATE_SELECTED_TRANS, payload: { selectedTrans } });
    } else {
      alert("You can mine at most 4 transactions at a time!");
    }
  }

  return (
    <div className="container-fluid">
      <h3 className="font-weight-bold">Verified Transactions</h3>
      <div className="trans-list row flex-nowrap overflow-auto bg-dark mx-1 px-2 rounded">
        {state.verifiedTrans.map((transaction: ITransaction, i: number) => {
          return (
            <div
              className={
                "trans-item " +
                (state.selectedTrans.map((x) => x.signature).includes(transaction.signature) ? "selected" : "not-selected") // prettier-ignore
              }
              onClick={() => selectTransaction(transaction)}
              key={`verifiedTrans${i}`}
            >
              <Form.Group className="mb-2 text-center">
                <Form.Control className="text-truncate" type="text" defaultValue={transaction.from} readOnly />
                <h3 className="my-0">↓</h3>
                <Form.Control className="text-truncate" type="text" defaultValue={transaction.to} readOnly />
              </Form.Group>

              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>Msg</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="textarea" defaultValue={transaction.message} readOnly />
              </InputGroup>

              <InputGroup className="mb-2">
                <Form.Control type="number" defaultValue={transaction.amount} disabled />
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
    </div>
  );
}
