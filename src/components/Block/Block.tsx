import React, { useContext, useRef } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { ACTIONS } from "../../enums/AppDispatchActions";

import "./Block.scss";

export interface IBlockProps {
  chain: boolean;
  merkleRoot: string;
  isValid: boolean[];
  setIsValid: (arg: boolean[]) => void;
  solution: string[];
  setSolution: (arg: string[]) => void;
  index?: number;
}

export default function Block(props: IBlockProps): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const blockIndex = props.index ?? state.chain[state.chain.length - 1].index;
  const index = useRef<number>(props.chain ? blockIndex : blockIndex + 1);
  const prevHash = useRef<string>(state.chain[blockIndex].currHash);
  const timestamp = useRef<number>(props.chain ? state.chain[blockIndex].timestamp : Date.now());

  function handleAddBlock() {
    const block = {
      index: index.current,
      prevHash: prevHash.current,
      currHash: props.solution[0],
      transactions: state.selectedTrans,
      timestamp: timestamp.current,
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
    prevHash.current = props.solution[0];
    props.setSolution([""]);
    props.setIsValid([false]);
  }

  function handleViewTransactions(): void {
    const block = state.chain[index.current];
    dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { block: { ...block, showTrans: !block.showTrans } } });
  }

  return (
    <Form
      className={
        (props.chain ? "" : "col-10 col-lg-5 ") +
        "my-4 my-lg-0 p-2 rounded " +
        (props.isValid[props.index ?? 0] ? "valid-block" : "invalid-block")
      }
    >
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
        <Form.Control
          type="number"
          value={props.solution[props.index ?? 0] ? Date.now() : timestamp.current}
          disabled
        />
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
        <Form.Control className="text-truncate" type="text" value={props.solution[props.index ?? 0]} readOnly />
      </InputGroup>

      <InputGroup className="mt-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Merkle #</InputGroup.Text>
        </InputGroup.Prepend>
        {index.current === 0 ? (
          <Form.Control type="text" defaultValue={""} disabled />
        ) : (
          <React.Fragment>
            <Form.Control
              key={props.merkleRoot}
              className="text-truncate"
              type="text"
              defaultValue={props.merkleRoot}
              readOnly
            />
            {props.chain && (
              <InputGroup.Append>
                <InputGroup.Text className="show-trans-eye" onClick={() => handleViewTransactions()}>
                  {state.chain[index.current].showTrans ? "🙈" : "🙉"}
                </InputGroup.Text>
              </InputGroup.Append>
            )}
          </React.Fragment>
        )}
      </InputGroup>

      {props.isValid[0] && !props.chain && (
        <Button className="mt-2" variant="success" block onClick={() => handleAddBlock()}>
          <h4 className="my-0">Add Block</h4>
        </Button>
      )}
    </Form>
  );
}
