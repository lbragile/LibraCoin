import React from "react";

import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import { ISign } from "./SignUI";

interface ISend extends ISign {
  details: { to: string; amount: number; message: string; signature: string };
  setSigned: (arg: boolean) => void;
  setValidated: (arg: boolean) => void;
}

export default function SendUI(props: ISend): JSX.Element {
  return (
    <div>
      <Modal
        show={props.show}
        validated={props.validated.toString()}
        centered
        backdrop="static"
        onHide={() => {
          props.setShow(false);
          props.setSigned(false);
          props.setValidated(false);
        }}
        animation={false}
      >
        <Modal.Header closeButton>
          <h4>LibraCoin Transaction (Send)</h4>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={props.handleSubmit}>
            <Form.Group controlId="SendTo">
              <Form.Label>
                <b>To:</b>
              </Form.Label>
              <Form.Control type="text" defaultValue={props.details.to} disabled={true} />
            </Form.Group>

            <Form.Group controlId="SendAmount">
              <Form.Label>
                <b>Amount:</b>
              </Form.Label>
              <InputGroup className="mb-2">
                <Form.Control type="text" defaultValue={props.details.amount} disabled={true} />
                <InputGroup.Prepend>
                  <InputGroup.Text>LC</InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="TransMessage">
              <Form.Label>
                <b>Message:</b>
              </Form.Label>
              <Form.Control as="textarea" defaultValue={props.details.message} rows={3} disabled={true} />
            </Form.Group>

            <Form.Group controlId="SendSignature">
              <Form.Label>
                <b>Signature:</b>
              </Form.Label>
              <Form.Control type="text" defaultValue={props.details.signature} disabled={true} />
              <Form.Text className="text-muted">
                Receiver uses this along with your public key to verify transaction.
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" block>
              <b>Send</b>
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
