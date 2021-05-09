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
    <Form noValidate className="col-12 col-lg-5 my-2 my-lg-0 trans-form" onSubmit={(e) => props.handleSubmit(e)}>
      <Form.Group>
        <Form.Control type="text" defaultValue={props.details.to} disabled={true} />
        <Form.Text className="text-muted">The receiver&apos;s public key</Form.Text>
      </Form.Group>

      <Form.Group>
        <InputGroup className="mb-2">
          <Form.Control type="number" defaultValue={props.details.amount} disabled={true} />
          <InputGroup.Prepend>
            <InputGroup.Text>LC</InputGroup.Text>
          </InputGroup.Prepend>
        </InputGroup>
      </Form.Group>

      <Form.Group>
        <Form.Control
          as="textarea"
          defaultValue={props.details.message}
          rows={5}
          placeholder="optional message..."
          disabled={true}
        />
      </Form.Group>

      <Form.Group>
        <Form.Control type="text" defaultValue={props.details.signature} disabled={true} />
        <Form.Text className="text-muted">
          Transaction Signature → receiver uses this along with your public key to verify transaction.
        </Form.Text>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={!props.signed} block>
        <b>Send</b>
      </Button>
    </Form>
  );
}
