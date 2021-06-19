import React, { useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { ACTIONS } from "../../enums/AppDispatchActions";

import "./Block.scss";

export interface IBlockProps {
  chain: boolean;
  index: number;
}

export default function Block({ chain, index }: IBlockProps): JSX.Element {
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
    dispatch({ type: ACTIONS.UPDATE_PREVIEW, payload: { preview } });
  }

  function handleViewTransactions(): void {
    const block = state.chain[index];
    dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { block: { ...block, showTrans: !block.showTrans } } });
  }

  return (
    <Form
      aria-label="Block Form"
      className={
        (chain ? "" : "col-10 col-lg-5 ") +
        "my-4 my-lg-0 p-2 rounded " +
        ((chain && state.chain[index].valid) || (!chain && state.preview.valid) ? "valid-block" : "invalid-block")
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
          value={chain ? index : state.preview.index}
          disabled
        />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Timestamp</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Block Timestamp"
          name="timestamp"
          type="number"
          value={chain ? state.chain[index].timestamp : state.preview.timestamp}
          disabled
        />
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
          value={chain && index > 0 ? state.chain[index - 1].currHash : chain ? "" : state.preview.prevHash}
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
          value={chain ? state.chain[index].currHash : state.preview.currHash}
          readOnly
        />
      </InputGroup>

      <InputGroup className="mt-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Merkle #</InputGroup.Text>
        </InputGroup.Prepend>
        {chain && index === 0 ? (
          <Form.Control aria-label="Block Merkle Genesis" name="merkleRoot" type="text" defaultValue={""} disabled />
        ) : (
          <React.Fragment>
            <Form.Control
              aria-label="Block Merkle"
              name="merkleRoot"
              className="text-truncate"
              type="text"
              value={chain ? state.chain[index].merkleRoot : state.preview.merkleRoot}
              readOnly
            />
            {chain && (
              <InputGroup.Append>
                <InputGroup.Text
                  aria-label="Show Trans"
                  className="show-trans-eye"
                  onClick={() => handleViewTransactions()}
                >
                  {state.chain[index].showTrans ? "🙈" : "🙉"}
                </InputGroup.Text>
              </InputGroup.Append>
            )}
          </React.Fragment>
        )}
      </InputGroup>

      {!chain && state.preview.valid && (
        <Button aria-label="Add Block" className="mt-2" variant="success" block onClick={() => handleAddBlock()}>
          <h4 className="my-0">Add Block</h4>
        </Button>
      )}
    </Form>
  );
}
