import React, { useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { ACTIONS } from "../../enums/AppDispatchActions";

import "./Block.scss";

export interface IBlockProps {
  chain: boolean;
  merkleRoot: string;
  index: number;
}

export default function Block(props: IBlockProps): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  function handleAddBlock() {
    // this only happens on the mining page so can use state.preview.index here

    const block = {
      ...state.preview,
      transactions: state.selectedTrans,
      valid: state.chain[state.preview.index - 1].valid, // validity depends on previous block
      showTrans: false
    };

    const preview = {
      timestamp: Date.now(),
      index: state.preview.index + 1,
      prevHash: state.preview.currHash,
      currHash: "",
      merkleRoot: "",
      valid: false
    };

    // add the block, update verified transactions, clear selected transactions, update preview
    dispatch({ type: ACTIONS.ADD_BLOCK, payload: { block } });
    dispatch({ type: ACTIONS.UPDATE_VERIFIED_TRANS });
    dispatch({ type: ACTIONS.UPDATE_SELECTED_TRANS, payload: { selectedTrans: [] } });
    dispatch({ type: ACTIONS.UPDATE_PREVIEW, payload: preview });
  }

  function handleViewTransactions(): void {
    const block = state.chain[props.index];
    dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { block: { ...block, showTrans: !block.showTrans } } });
  }

  return (
    <Form
      aria-label="Block Form"
      className={
        (props.chain ? "" : "col-10 col-lg-5 ") +
        "my-4 my-lg-0 p-2 rounded " +
        ((props.chain && state.chain[props.index].valid) || (!props.chain && state.preview.valid)
          ? "valid-block"
          : "invalid-block")
      }
    >
      <InputGroup className="mb-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Index</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Block Index"
          name="index"
          type="number"
          value={props.index === 0 ? state.preview.index : props.index}
          disabled
        />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Timestamp</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control aria-label="Block Timestamp" name="timestamp" type="number" defaultValue={Date.now()} disabled />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Previous #</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Block PrevHash"
          name="prevHash"
          className="text-truncate"
          type="text"
          value={props.chain ? state.chain[props.index - 1].currHash : state.preview.prevHash}
          readOnly
        />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Current #</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Block CurrHash"
          name="currHash"
          className="text-truncate"
          type="text"
          value={props.chain ? state.chain[props.index].currHash : state.preview.currHash}
          readOnly
        />
      </InputGroup>

      <InputGroup className="mt-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Merkle #</InputGroup.Text>
        </InputGroup.Prepend>
        {props.chain && props.index === 0 ? (
          <Form.Control aria-label="Block Merkle Genesis" name="merkle" type="text" defaultValue={""} disabled />
        ) : (
          <React.Fragment>
            <Form.Control
              aria-label="Block Merkle"
              name="merkle"
              key={props.merkleRoot}
              className="text-truncate"
              type="text"
              defaultValue={props.merkleRoot}
              readOnly
            />
            {props.chain && (
              <InputGroup.Append>
                <InputGroup.Text
                  aria-label="Show Trans"
                  className="show-trans-eye"
                  onClick={() => handleViewTransactions()}
                >
                  {state.chain[props.index].showTrans ? "🙈" : "🙉"}
                </InputGroup.Text>
              </InputGroup.Append>
            )}
          </React.Fragment>
        )}
      </InputGroup>

      {((!props.chain && state.preview.valid) || (props.chain && state.chain[props.index].valid)) && (
        <Button aria-label="Add Block" className="mt-2" variant="success" block onClick={() => handleAddBlock()}>
          <h4 className="my-0">Add Block</h4>
        </Button>
      )}
    </Form>
  );
}
