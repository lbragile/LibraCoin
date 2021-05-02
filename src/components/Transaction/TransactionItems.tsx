import React, { useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, IState, ITransaction } from "../../typings/AppTypes";

import "./Transaction.css";

export default function TransactionLineUI(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  function selectTransaction(transaction: ITransaction): void {
    let selectedTrans = (JSON.parse(localStorage.getItem("selectedTransactions") as string) as ITransaction[]) || [];
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
      localStorage.setItem("selectedTransactions", JSON.stringify(selectedTrans));
    } else {
      alert("You can mine at most 4 transactions at a time!");
    }
  }

  return (
    <div className="container-fluid">
      <h3 className="font-weight-bold">Verified Transactions</h3>
      <div className="row flex-nowrap overflow-auto bg-dark mx-1 px-2 rounded">
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
              <Form.Group className="mb-2 text-center">
                <Form.Control type="text" defaultValue={transaction.from} disabled={true} />
                <h3 className="my-0">↓</h3>
                <Form.Control type="text" defaultValue={transaction.to} disabled={true} />
              </Form.Group>

              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>Msg</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="textarea" defaultValue={transaction.message} disabled={true} />
              </InputGroup>

              <InputGroup className="mb-2">
                <Form.Control type="number" defaultValue={transaction.amount} disabled={true} />
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
    </div>
  );
}
