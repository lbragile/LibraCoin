import React, { useContext } from "react";
import { Form } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, IState, ITransaction } from "../../typings/AppTypes";

import "./Transaction.css";

export default function TransactionLineUI(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  function selectTransaction(transaction: ITransaction): void {
    let selectedTrans = (JSON.parse(localStorage.getItem("selectedTransactions") as string) as ITransaction[]) || [];
    const signatures = selectedTrans.map((x) => x.signature);

    // if just selected - push onto stack, else remove it
    // adjust backgrounds according to selection/deselection
    if (!signatures.includes(transaction.signature)) {
      selectedTrans.push(transaction);
    } else {
      selectedTrans = selectedTrans.filter((x) => x.signature !== transaction.signature);
    }

    dispatch({ type: ACTIONS.UPDATE_SELECTED_TRANS, payload: { selectedTrans } });
    localStorage.setItem("selectedTransactions", JSON.stringify(selectedTrans));
  }

  return (
    <div>
      <h3>
        <b>Verified Transactions:</b>
      </h3>
      <div id="list-background">
        {state.verifiedTrans.map((transaction: ITransaction) => {
          return (
            <div
              className={
                "trans-item " +
                (state.selectedTrans.map((x) => x.signature).includes(transaction.signature) ? "selected" : "not-selected") // prettier-ignore
              }
              onClick={() => selectTransaction(transaction)}
              key={Math.random()}
            >
              <Form.Group className="mb-1 text-center">
                <Form.Control type="text" defaultValue={transaction.from} disabled={true} />
                <h3 className="my-0">↓</h3>
                <Form.Control type="text" defaultValue={transaction.to} disabled={true} />
              </Form.Group>

              <Form.Group className="mb-1">
                <Form.Label>
                  <h5 className="my-0">Message:</h5>
                </Form.Label>
                <Form.Control as="textarea" defaultValue={transaction.message} disabled={true} />
              </Form.Group>

              <Form.Group className="mb-1">
                <Form.Label>
                  <h5 className="my-0">Amount:</h5>
                </Form.Label>
                <Form.Control type="number" defaultValue={transaction.amount} disabled={true} />
              </Form.Group>

              <Form.Group className="mb-1">
                <Form.Label>
                  <h5 className="my-0">Signature:</h5>
                </Form.Label>
                <Form.Control type="text" defaultValue={transaction.signature} disabled={true} />
              </Form.Group>
            </div>
          );
        })}
      </div>
    </div>
  );
}
