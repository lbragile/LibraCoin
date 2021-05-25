import React from "react";

import { Form, Button, InputGroup } from "react-bootstrap";
import { ITransaction } from "../../typings/AppTypes";
import { ISign } from "./Sign";

interface ISend extends ISign {
  details: ITransaction;
  setSigned: (arg: boolean) => void;
  setValidated: (arg: boolean) => void;
}

export default function Send(props: ISend): JSX.Element {
  return (
    <Form
      aria-label="Send Form"
      noValidate
      className="col-12 col-lg-5 my-2 my-lg-0 trans-form"
      onSubmit={(e) => props.handleSubmit(e)}
    >
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>Receiver Public Key</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Receiver Public Key"
          name="receiver-pk"
          className="text-truncate"
          type="text"
          defaultValue={props.details.to}
          readOnly
        />
      </InputGroup>

      <Form.Text className="text-muted">Make sure this matches the value used when signing</Form.Text>

      <InputGroup className="my-2">
        <Form.Control
          aria-label="Send Amount"
          name="amount"
          type="number"
          defaultValue={props.details.amount}
          disabled
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
          defaultValue={props.details.message}
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
          defaultValue={props.details.signature}
          readOnly
        />
      </InputGroup>

      <Form.Text className="text-muted">Receiver uses this along with your public key to verify transaction</Form.Text>

      <Button aria-label="Send Button" className="mt-2" variant="primary" type="submit" disabled={!props.signed} block>
        <b>Send</b>
      </Button>
    </Form>
  );
}
