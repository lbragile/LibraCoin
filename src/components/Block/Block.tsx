import React from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";

import { useAppContext } from "../../hooks/useAppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";

import { ThemeProvider } from "styled-components";
import { RevealBlockTransText, StyledBlockForm, StyledButton } from "../../styles/BlockStyles";
import { StyledInputGroupText } from "../../styles/GlobalStyles";

export interface IBlockProps {
  chain: boolean;
  index: number;
}

export default function Block({ chain, index }: IBlockProps): JSX.Element {
  const { state, dispatch } = useAppContext();

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

  const isValid = (chain && state.chain[index].valid) || (!chain && state.preview.valid);
  return (
    <ThemeProvider theme={{ valid: isValid }}>
      <StyledBlockForm
        aria-label={"Block Form" + (isValid ? "" : " Invalid")}
        className={(chain ? "" : "col-11 col-lg-5 ") + "p-2 rounded"}
      >
        <Row>
          <Col lg={!chain && state.preview.valid ? 9 : 12}>
            <InputGroup className="mb-2">
              <InputGroup.Prepend>
                <StyledInputGroupText>Index</StyledInputGroupText>
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
                <StyledInputGroupText>Timestamp</StyledInputGroupText>
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
                <StyledInputGroupText>Previous #</StyledInputGroupText>
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
                <StyledInputGroupText>Current #</StyledInputGroupText>
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
                <StyledInputGroupText>Merkle #</StyledInputGroupText>
              </InputGroup.Prepend>
              {chain && index === 0 ? (
                <Form.Control
                  aria-label="Block Merkle Genesis"
                  name="merkleRoot"
                  type="text"
                  defaultValue=""
                  disabled
                />
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
                      <RevealBlockTransText aria-label="Show Trans" onClick={() => handleViewTransactions()}>
                        {state.chain[index].showTrans ? "🙈" : "🙉"}
                      </RevealBlockTransText>
                    </InputGroup.Append>
                  )}
                </React.Fragment>
              )}
            </InputGroup>
          </Col>
          <Col lg={!chain && state.preview.valid ? 3 : 0}>
            {!chain && state.preview.valid && (
              <StyledButton
                aria-label="Add Block"
                className="mt-2 mt-lg-0"
                variant="success"
                block
                onClick={() => handleAddBlock()}
              >
                <h4 className="my-0">Add Block</h4>
              </StyledButton>
            )}
          </Col>
        </Row>
      </StyledBlockForm>
    </ThemeProvider>
  );
}
