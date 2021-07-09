import React from "react";

import { Form, Button, InputGroup } from "react-bootstrap";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { useAppContext } from "../../hooks/useAppContext";
import { StyledInputGroupText } from "../../styles/GlobalStyles";
import { TransForm } from "../../styles/TransactionStyles";

export default function Send(): JSX.Element {
  const { state, dispatch } = useAppContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({ type: ACTIONS.SET_SIGNED, payload: { signed: false } });
    dispatch({ type: ACTIONS.SET_VALIDATED, payload: { validated: false } });
    dispatch({ type: ACTIONS.ADD_VERIFIED_TRANS, payload: { trans: state.wallet.details } });
    dispatch({
      type: ACTIONS.SET_DETAILS,
      payload: { details: { from: "", to: "", amount: (0).toFixed(2), msg: "", signature: "" } }
    });
  };

  return (
    <TransForm aria-label="Send Form" noValidate className="col-12 col-lg-5 my-2 my-lg-0" onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroup.Prepend>
          <StyledInputGroupText>Receiver Public Key</StyledInputGroupText>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Receiver PK"
          name="receiver-pk"
          className="text-truncate"
          type="text"
          value={state.wallet.details.to}
          readOnly
        />
      </InputGroup>

      <Form.Text className="text-light">Make sure this matches the value used when signing</Form.Text>

      <InputGroup className="my-2">
        <Form.Control
          aria-label="Send Amount"
          name="amount"
          type="number"
          value={state.wallet.details.amount}
          readOnly
        />
        <InputGroup.Append>
          <StyledInputGroupText className="rounded-right border-left-0">LC</StyledInputGroupText>
        </InputGroup.Append>
      </InputGroup>

      <InputGroup className="mb-2">
        <InputGroup.Prepend>
          <StyledInputGroupText>Message</StyledInputGroupText>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Send Message"
          name="msg"
          as="textarea"
          value={state.wallet.details.msg}
          rows={4}
          placeholder="optional message..."
          readOnly
        />
      </InputGroup>

      <InputGroup>
        <InputGroup.Prepend>
          <StyledInputGroupText>Transaction Signature</StyledInputGroupText>
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

      <Form.Text className="text-light">Receiver uses this along with your public key to verify transaction</Form.Text>

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
    </TransForm>
  );
}
