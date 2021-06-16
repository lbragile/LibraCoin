import React, { useContext, useEffect } from "react";

import { Form, Button, InputGroup } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, IState } from "../../typings/AppTypes";
import { digestMessage } from "../../utils/conversion";

export default function Sign(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  useEffect(() => {
    dispatch({ type: ACTIONS.SET_VALIDATED, payload: { validated: false } });
    dispatch({ type: ACTIONS.SET_SIGNED, payload: { signed: false, sent: false } });
    dispatch({
      type: ACTIONS.SET_DETAILS,
      payload: {
        details: { from: state.user.publicKey, to: "", amount: Number(0).toFixed(2), message: "", signature: "" }
      }
    });
  }, [dispatch, state.user.publicKey]);

  function checkAmount(e: React.FocusEvent<HTMLInputElement>): void {
    e.target.value = Math.min(Math.max(0.1, +e.target.value), state.user.balance).toFixed(2);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!state.wallet.validated) {
      dispatch({ type: ACTIONS.SET_VALIDATED, payload: { validated: true } });
    }

    const form = e.currentTarget;
    if (form.checkValidity()) {
      const formValues = Object.values({ ...form }).slice(1, 4).map((input) => input.value); // prettier-ignore
      const currentDetails = { ...state.wallet.details };
      [currentDetails.to, currentDetails.amount, currentDetails.message] = formValues;

      const message = currentDetails.to + currentDetails.from + currentDetails.message + currentDetails.amount;
      currentDetails.signature = await digestMessage(message);
      dispatch({ type: ACTIONS.SET_SIGNED, payload: { signed: true } });
      dispatch({ type: ACTIONS.SET_DETAILS, payload: { details: currentDetails } });
    }
  };

  return (
    <Form
      aria-label="Sign Form"
      noValidate
      validated={state.wallet.validated}
      className="col-12 col-lg-5 trans-form"
      onSubmit={handleSubmit}
    >
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>Sender Public Key</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Sender Public Key"
          name="sender-pk"
          className="text-truncate rounded-right"
          type="text"
          value={state.user.publicKey}
          readOnly
        />
      </InputGroup>

      <Form.Text className="text-muted">Used to verify transaction was signed using your private key</Form.Text>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Receiver Public Key</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Receiver Public Key"
          name="receiver-pk"
          className="text-truncate rounded-right"
          type="text"
          pattern="[A-Za-z0-9]{182}"
          required
          readOnly={state.wallet.signed}
        />
        <Form.Control.Feedback
          className="font-weight-bold"
          type="invalid"
          role="alert"
          aria-label="Receiver PK Feedback"
        >
          Length or format are incorrect!
        </Form.Control.Feedback>
      </InputGroup>

      <InputGroup className="mb-2">
        <Form.Control
          aria-label="Sign Amount"
          name="amount"
          type="number"
          step="any"
          placeholder={Number(1).toFixed(2)}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => checkAmount(e)}
          required
          readOnly={state.wallet.signed}
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
          aria-label="Sign Message"
          name="msg"
          as="textarea"
          rows={2}
          placeholder="optional message..."
          readOnly={state.wallet.signed}
        />
      </InputGroup>

      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>Sender Private Key</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Sender Private Key"
          name="sender-sk"
          className="text-truncate"
          type="text"
          value={state.user.privateKey}
          readOnly
        />
      </InputGroup>

      <Form.Text className="text-muted">Not shared with anyone, keep this secret!</Form.Text>

      <Button
        aria-label="Sign Button"
        className="mt-2"
        variant={state.wallet.signed ? "success" : "primary"}
        type="submit"
        disabled={state.wallet.signed}
        block
      >
        <b>{state.wallet.signed ? "Signed" : "Sign"}</b>
      </Button>
    </Form>
  );
}
