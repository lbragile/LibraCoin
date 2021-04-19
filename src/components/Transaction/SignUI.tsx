import React from "react";

import { Modal, Form, Button, InputGroup } from "react-bootstrap";

export interface ISign {
  show: boolean;
  setShow: (arg: boolean) => void;
  validated: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SignUI(props: ISign): JSX.Element {
  function checkAmount(e: React.ChangeEvent<HTMLInputElement>): void {
    const userBalance = JSON.parse(localStorage.getItem("user") as string)?.balance || 1000;
    e.target.value = Math.min(Math.max(0.1, +e.target.value), userBalance)
      .toFixed(2)
      .toString();
  }

  return (
    <div>
      <Modal show={props.show} centered backdrop="static" onHide={() => props.setShow(false)} animation={false}>
        <Modal.Header closeButton>
          <h4>LibraCoin Transaction (Sign)</h4>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={props.validated} onSubmit={props.handleSubmit}>
            <Form.Group controlId="TransFrom">
              <Form.Label>
                <b>From:</b>
              </Form.Label>
              <Form.Control
                type="text"
                defaultValue={JSON.parse(localStorage.getItem("user") as string)?.publicKey || ""}
              />
              <Form.Text className="text-muted">
                Your public key → used to verify transaction was signed using your private key
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="TransTo">
              <Form.Label>
                <b>To:</b>
              </Form.Label>
              <Form.Control type="text" pattern="[A-Za-z0-9]{182,182}" required />
              <Form.Control.Feedback type="invalid">
                Must be of the same format as your public key
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="TransAmount">
              <Form.Label>
                <b>Amount:</b>
              </Form.Label>
              <InputGroup className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="1.00"
                  onBlur={(e: React.ChangeEvent<HTMLInputElement>) => checkAmount(e)}
                  required
                />
                <InputGroup.Prepend>
                  <InputGroup.Text>LC</InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="TransMessage">
              <Form.Label>
                <b>Message:</b>
              </Form.Label>
              <Form.Control as="textarea" placeholder="optional message..." rows={3} />
            </Form.Group>

            <Form.Group controlId="TransPrivate">
              <Form.Label>
                <b>Private Key:</b>
              </Form.Label>
              <Form.Control
                type="text"
                defaultValue={JSON.parse(localStorage.getItem("user") as string)?.privateKey || ""}
                required
              />
              <Form.Text className="text-muted">This is not shared with anyone, keep this secret!</Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" block>
              <b>Sign</b>
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
