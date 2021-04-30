import React from "react";

import { Form, Button, InputGroup } from "react-bootstrap";

export interface ISign {
  validated: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SignUI({ validated, handleSubmit }: ISign): JSX.Element {
  function checkAmount(e: React.ChangeEvent<HTMLInputElement>): void {
    const userBalance = JSON.parse(localStorage.getItem("user") as string)?.balance || 1000;
    e.target.value = Math.min(Math.max(0.1, +e.target.value), userBalance)
      .toFixed(2)
      .toString();
  }

  return (
    <Form noValidate validated={validated} className="col-5 trans-form" onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Control
          type="text"
          defaultValue={JSON.parse(localStorage.getItem("user") as string)?.publicKey || ""}
          disabled={true}
        />
        <Form.Text className="text-muted">
          Your public key → used to verify transaction was signed using your private key
        </Form.Text>
        <h3 className="my-0 text-center">↓</h3>
        <Form.Control type="text" placeholder="Receiver's public key" pattern="[A-Za-z0-9]{182,182}" required />
        <Form.Control.Feedback type="invalid">Must be of the same format as your public key</Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <InputGroup className="mb-2">
          <Form.Control
            type="number"
            placeholder="1.00"
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => checkAmount(e)}
            required
          />
          <InputGroup.Prepend>
            <InputGroup.Text>LC</InputGroup.Text>
          </InputGroup.Prepend>
        </InputGroup>
      </Form.Group>

      <Form.Group>
        <Form.Control as="textarea" rows={2} placeholder="optional message..." />
      </Form.Group>

      <Form.Group>
        <Form.Control
          type="text"
          defaultValue={JSON.parse(localStorage.getItem("user") as string)?.privateKey || ""}
          disabled={true}
        />
        <Form.Text className="text-muted">Your private key → not shared with anyone, keep this secret!</Form.Text>
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        disabled={!JSON.parse(localStorage.getItem("user") as string)?.publicKey || validated}
        block
      >
        <b>Sign</b>
      </Button>
    </Form>
  );
}
