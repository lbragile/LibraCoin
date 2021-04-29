import React, { useContext } from "react";
import { Form } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, IState } from "../../typings/AppTypes";

interface ITransaction {
  to: string;
  from: string;
  amount: number;
  message: string;
  signature?: string;
  index?: number;
}

interface ITransactionLineProps {
  title: string;
  copied: boolean;
  copyPublicKey: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function TransactionLineUI({ title, copied, copyPublicKey }: ITransactionLineProps): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  function selectTransaction(e: React.MouseEvent<HTMLDivElement>, transaction: ITransaction): void {
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
        <b>{title}:</b>
      </h3>
      <div id="list-background">
        {state.verifiedTrans.map((transaction: ITransaction) => {
          return (
            <div
              className="item"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => selectTransaction(e, transaction)}
              style={{
                background: state.selectedTrans.map((x) => x.signature).includes(transaction.signature)
                  ? "#DDFFDD"
                  : "white",
              }}
              key={Math.random()}
            >
              <Form.Group className="mb-1">
                <Form.Label>
                  <h5 className="my-0">From:</h5>
                </Form.Label>
                <Form.Control type="text" className="text-truncate" defaultValue={transaction.from} />
              </Form.Group>

              <Form.Group className="mb-1">
                <Form.Label>
                  <h5 className="my-0">To:</h5>
                </Form.Label>
                <Form.Control type="text" className="text-truncate" defaultValue={transaction.to} />
              </Form.Group>

              <Form.Group className="mb-1">
                <Form.Label>
                  <h5 className="my-0">Message:</h5>
                </Form.Label>
                <Form.Control as="textarea" className="text-truncate" defaultValue={transaction.message} />
              </Form.Group>

              <Form.Group className="mb-1">
                <Form.Label>
                  <h5 className="my-0">Amount:</h5>
                </Form.Label>
                <Form.Control type="number" className="text-truncate" defaultValue={transaction.amount} />
              </Form.Group>

              <Form.Group className="mb-1">
                <Form.Label>
                  <h5 className="my-0">Signature:</h5>
                </Form.Label>
                <Form.Control
                  type="text"
                  className="text-truncate"
                  defaultValue={transaction.signature}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => copyPublicKey(e)}
                  isValid={copied}
                />
                <Form.Control.Feedback type="valid">Copied to clipboard</Form.Control.Feedback>
              </Form.Group>
            </div>
          );
        })}
      </div>
    </div>
  );
}
