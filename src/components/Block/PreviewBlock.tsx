import React, { useContext, useRef } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { ACTIONS } from "../../enums/AppDispatchActions";

import "./Block.scss";

interface IPreviewBlockProps {
  merkleRoot: string;
  isValid: boolean;
  setIsValid: (arg: boolean) => void;
  solution: string;
  setSolution: (arg: string) => void;
}

export default function PreviewBlock(props: IPreviewBlockProps): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const index = useRef<number>(state.chain[state.chain.length - 1].index + 1);
  const prevHash = useRef<string>(state.chain[state.chain.length - 1].currHash);

  function handleAddBlock() {
    const block = {
      index: index.current,
      prevHash: prevHash.current,
      currHash: props.solution,
      transactions: state.selectedTrans,
      timestamp: Date.now(),
      merkleRoot: props.merkleRoot,
      valid: state.chain[index.current - 1].valid, // validity depends on previous block
      showTrans: false
    };

    // add the block, update verified transactions, clear selected transactions
    dispatch({ type: ACTIONS.ADD_BLOCK, payload: { block } });
    dispatch({ type: ACTIONS.UPDATE_VERIFIED_TRANS });
    dispatch({ type: ACTIONS.UPDATE_SELECTED_TRANS, payload: { selectedTrans: [] } });

    // update preview details
    index.current += 1;
    prevHash.current = props.solution;
    props.setIsValid(false);
    props.setSolution("");
  }

  return (
    <Form className={"col-10 col-lg-5 my-4 my-lg-0 p-2 rounded " + (props.isValid ? "valid-block" : "invalid-block")}>
      <InputGroup className="mb-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Index</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control key={index.current} type="number" defaultValue={index.current} disabled />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Timestamp</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control key={props.solution} type="number" defaultValue={Date.now()} disabled />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Previous #</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          key={prevHash.current}
          className="text-truncate"
          type="text"
          defaultValue={prevHash.current}
          readOnly
        />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Current #</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control className="text-truncate" type="text" defaultValue={props.solution} readOnly />
      </InputGroup>

      <InputGroup className="mt-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Merkle #</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control className="text-truncate" type="text" defaultValue={props.merkleRoot} readOnly />
      </InputGroup>

      {props.isValid && (
        <Button className="mt-2" variant="success" block onClick={() => handleAddBlock()}>
          <h4 className="my-0">Add Block</h4>
        </Button>
      )}
    </Form>
  );
}
