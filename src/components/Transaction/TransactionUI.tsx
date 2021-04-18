import React, { useState } from "react";

import { Modal, Form, Button, InputGroup } from "react-bootstrap";

export default function TransactionUI(): JSX.Element {
  const [show, setShow] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
  };

  function checkAmount(e: React.ChangeEvent<HTMLInputElement>): void {
    const userBalance = JSON.parse(localStorage.getItem("user") as string)?.balance || 1000;
    e.target.value = Math.min(Math.max(0.1, +e.target.value), userBalance)
      .toFixed(2)
      .toString();
  }

  return (
    <div>
      <button className="font-weight-bold btn btn-info p-3 my-5" onClick={() => setShow(true)}>
        Make Transaction
      </button>
      <Modal show={show} centered backdrop="static" onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <h4>LibraCoin Transaction</h4>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
              Sign
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
