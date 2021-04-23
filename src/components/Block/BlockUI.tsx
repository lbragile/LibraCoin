import React from "react";

import { Button, Form } from "react-bootstrap";
import { Chain } from "../Chain/chain_class";

import "./Block.css";

interface IBlock {
  chain: boolean;
  isValid: boolean;
  showBtn: boolean;
  solution: string;
  setShowBtn: (arg: boolean) => void;
  children?: JSX.Element;
}

export default function BlockUI(props: IBlock): JSX.Element {
  function handleAddBlock() {
    Chain.instance.addBlock(props.solution, []);
    props.setShowBtn(false);
  }

  return (
    <div className={"block " + (props.isValid ? "valid-block" : "invalid-block")}>
      <Form.Group>
        <Form.Label>
          <h5>Index:</h5>
        </Form.Label>
        <Form.Control
          type="number"
          defaultValue={props.solution && Chain.instance.lastBlock.index + 1}
          disabled={true}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          <h5>Timestamp:</h5>
        </Form.Label>
        <Form.Control type="number" defaultValue={props.solution ? Date.now() : ""} disabled={true} />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          <h5>Previous Hash:</h5>
        </Form.Label>
        <Form.Control type="text" defaultValue={props.solution && Chain.instance.lastBlock.currHash} disabled={true} />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          <h5>Current Hash:</h5>
        </Form.Label>
        <Form.Control type="text" defaultValue={props.solution} disabled={true} />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          <h5>Merkle Root:</h5>
        </Form.Label>
        <Form.Control type="text" defaultValue={"abc"} disabled={true} />
      </Form.Group>

      {!props.chain && props.isValid && props.showBtn && (
        <Button variant="success" block onClick={() => handleAddBlock()}>
          <h3 className="my-0 font-weight-bold">+</h3>
        </Button>
      )}

      {props.children}
    </div>
  );
}
