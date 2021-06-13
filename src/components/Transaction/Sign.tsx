import React, { useContext } from "react";

import { Form, Button, InputGroup } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { IState } from "../../typings/AppTypes";

export interface ISign {
  validated: boolean;
  signed: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Sign({ validated, signed, handleSubmit }: ISign): JSX.Element {
  const { state } = useContext(AppContext) as { state: IState };

  function checkAmount(e: React.FocusEvent<HTMLInputElement>): void {
    e.target.value = Math.min(Math.max(0.1, +e.target.value), state.user.balance).toFixed(2);
  }

  return (
    <Form
      aria-label="Sign Form"
      noValidate
      validated={validated}
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
          defaultValue={state.user.publicKey}
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
          pattern="[A-Za-z0-9]{182,182}"
          required
        />
        <Form.Control.Feedback type="invalid">
          <b>Length or format are incorrect!</b>
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
        />
        <InputGroup.Prepend>
          <InputGroup.Text className="rounded-right border-left-0">LC</InputGroup.Text>
        </InputGroup.Prepend>
      </InputGroup>

      <InputGroup className="mb-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Message</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control aria-label="Sign Message" name="msg" as="textarea" rows={2} placeholder="optional message..." />
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
          defaultValue={state.user.privateKey}
          readOnly
        />
      </InputGroup>

      <Form.Text className="text-muted">Not shared with anyone, keep this secret!</Form.Text>

      <Button aria-label="Sign Button" className="mt-2" variant="primary" type="submit" disabled={signed} block>
        <b>Sign</b>
      </Button>
    </Form>
  );
}
