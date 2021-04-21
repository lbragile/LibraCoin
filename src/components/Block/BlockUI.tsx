import React from "react";

import { Form } from "react-bootstrap";

import "./Block.css";
import { Block } from "./block_class";

export default function BlockUI({ block, useChain }: { block: Block; useChain: boolean }): JSX.Element {
  return (
    <div className="block-and-chain my-2">
      <Form className={"block-background " + (block.index > 2 ? "invalid-block" : "valid-block")}>
        <Form.Group controlId="index-indicator">
          <Form.Label>
            <h5>Index:</h5>
          </Form.Label>
          <Form.Control type="number" defaultValue={block.index} />
        </Form.Group>

        <Form.Group controlId="index-indicator">
          <Form.Label>
            <h5>Timestamp:</h5>
          </Form.Label>
          <Form.Control type="number" defaultValue={block.timestamp} />
        </Form.Group>

        <Form.Group controlId="prevHash-indicator">
          <Form.Label>
            <h5>Previous Hash:</h5>
          </Form.Label>
          <Form.Control type="text" defaultValue={block.prevHash} />
        </Form.Group>

        <Form.Group controlId="prevHash-indicator">
          <Form.Label>
            <h5>Current Hash:</h5>
          </Form.Label>
          <Form.Control type="text" defaultValue={block.currHash} />
        </Form.Group>

        <Form.Group controlId="prevHash-indicator">
          <Form.Label>
            <h5>Merkle Root:</h5>
          </Form.Label>
          <Form.Control type="text" defaultValue={JSON.stringify(block.transactions)} />
        </Form.Group>
      </Form>

      {useChain && <div className="chain-link">🔗</div>}
    </div>
  );
}
