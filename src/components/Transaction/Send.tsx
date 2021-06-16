import React, { useContext } from "react";

import { Form, Button, InputGroup } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, IState } from "../../typings/AppTypes";

export default function Send(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({ type: ACTIONS.SET_SIGNED, payload: { signed: false } });
    dispatch({ type: ACTIONS.SET_VALIDATED, payload: { validated: false } });
    dispatch({ type: ACTIONS.ADD_VERIFIED_TRANS, payload: { trans: state.wallet.details } });
    dispatch({
      type: ACTIONS.SET_DETAILS,
      payload: { details: { from: "", to: "", amount: (0).toFixed(2), message: "", signature: "" } }
    });
  };

  return (
    <Form aria-label="Send Form" noValidate className="col-12 col-lg-5 my-2 my-lg-0 trans-form" onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>Receiver Public Key</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Receiver Public Key"
          name="receiver-pk"
          className="text-truncate"
          type="text"
          value={state.wallet.details.to}
          readOnly
        />
      </InputGroup>

      <Form.Text className="text-muted">Make sure this matches the value used when signing</Form.Text>

      <InputGroup className="my-2">
        <Form.Control
          aria-label="Send Amount"
          name="amount"
          type="number"
          value={state.wallet.details.amount}
          readOnly
        />
        <InputGroup.Append>
          <InputGroup.Text className="rounded-right border-left-0">LC</InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>

      <InputGroup className="mb-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Message</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Send Message"
          name="msg"
          as="textarea"
          value={state.wallet.details.message}
          rows={4}
          placeholder="optional message..."
          readOnly
        />
      </InputGroup>

      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>Transaction Signature</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Transaction Signature"
          name="sig"
          type="text"
          className="text-truncate"
          value={state.wallet.details.signature}
          readOnly
        />
      </InputGroup>

      <Form.Text className="text-muted">Receiver uses this along with your public key to verify transaction</Form.Text>

      <Button
        aria-label="Send Button"
        className="mt-2"
        variant={state.wallet.sent ? "success" : "primary"}
        type="submit"
        disabled={!state.wallet.signed}
        block
      >
        <b>{state.wallet.sent ? "Sent" : "Send"}</b>
      </Button>
    </Form>
  );
}
