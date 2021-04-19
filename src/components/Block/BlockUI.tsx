import React, { useState, useRef } from "react";
import { Transaction } from "../Transaction/transaction_class";

import { Modal, Form } from "react-bootstrap";

import "./Block.css";
export interface IBlock {
  index: number;
  prevHash: string;
  currHash: string;
  transactions: Transaction[];
  timestamp: number;
}

export default function BlockUI({ details }: { details: IBlock[] }): JSX.Element {
  const [show, setShow] = useState<boolean>(false);
  const blockItem = useRef<IBlock>({ index: 0, prevHash: "", currHash: "", transactions: [], timestamp: Date.now() });

  return (
    <div className="container-fluid mx-5 row">
      {details.map((block, i) => (
        <div className="row block-and-chain my-2" key={Math.random()}>
          <div
            className={"block-background " + (i > 2 ? "invalid-block" : "valid-block")}
            onClick={() => {
              blockItem.current = block;
              setShow(true);
            }}
          >
            <div className="block-counter">{i}</div>
          </div>
          <div className="chain-link">🔗</div>
        </div>
      ))}

      <Modal show={show} centered onHide={() => setShow(false)} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Block Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="index-indicator">
              <Form.Label>
                <h5>Index:</h5>
              </Form.Label>
              <Form.Control type="number" defaultValue={blockItem.current.index} />
            </Form.Group>

            <Form.Group controlId="index-indicator">
              <Form.Label>
                <h5>Timestamp:</h5>
              </Form.Label>
              <Form.Control type="number" defaultValue={blockItem.current.timestamp} />
            </Form.Group>

            <Form.Group controlId="prevHash-indicator">
              <Form.Label>
                <h5>Previous Hash:</h5>
              </Form.Label>
              <Form.Control type="text" defaultValue={blockItem.current.prevHash} />
            </Form.Group>

            <Form.Group controlId="prevHash-indicator">
              <Form.Label>
                <h5>Current Hash:</h5>
              </Form.Label>
              <Form.Control type="text" defaultValue={blockItem.current.currHash} />
            </Form.Group>

            <Form.Group controlId="prevHash-indicator">
              <Form.Label>
                <h5>Merkle Root:</h5>
              </Form.Label>
              <Form.Control type="text" defaultValue={JSON.stringify(blockItem.current.transactions)} />
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
