import React, { useState } from "react";

import { Modal, Form, Button, InputGroup } from "react-bootstrap";

export default function TransactionUI(): JSX.Element {
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
  };

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
              <Form.Control type="text" placeholder="Your Public Key" pattern="[A-Za-z0-9]{182,182}" required />
            </Form.Group>

            <Form.Group controlId="TransTo">
              <Form.Label>
                <b>To:</b>
              </Form.Label>
              <Form.Control type="text" placeholder="Receiver's Public Key" pattern="[A-Za-z0-9]{182,182}" required />
            </Form.Group>

            <Form.Group controlId="TransAmount">
              <Form.Label>
                <b>Amount:</b>
              </Form.Label>
              <InputGroup className="mb-2">
                <Form.Control
                  type="text"
                  id="inlineFormInputGroup"
                  placeholder="100.00"
                  pattern="[0-9]{1,10}\.[0-9]{2,4}"
                  required
                />
                <InputGroup.Prepend>
                  <InputGroup.Text>LC</InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="TransAmount">
              <Form.Label>
                <b>Private Key:</b>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Used to digitally sign this transaction"
                pattern="[A-Za-z0-9]{276,276}"
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
