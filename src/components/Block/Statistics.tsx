import React, { useState, useRef, useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, IState } from "../../typings/AppTypes";
import { digestMessage } from "../../utils/conversion";
import { createTarget } from "../../utils/mine";
// import { propagateBlockStatus } from "../../utils/propagate";

import "./Block.scss";

interface IStatisticsProps {
  chain: boolean;
  index?: number;
  prevHash?: string;
}

export default function Statistics(props: IStatisticsProps): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const nonce = useRef<number>(0);
  const [header, setHeader] = useState<number>(0);
  const [target, setTarget] = useState<string>("");
  const [solution, setSolution] = useState<string>("");
  const [disableMineBtn, setDisableMineBtn] = useState<boolean>(false);

  async function handleMine() {
    // const { index, prevHash } = props;

    nonce.current = Math.round(Math.random() * 1e6);

    setDisableMineBtn(true);
    // make target with 2 or 3 leading zeros
    const numZeros = Math.round(Math.random()) + 2;
    const targetHash = await createTarget(numZeros);
    setTarget(targetHash);

    // mine block for a new current hash (solution)
    let candidateSolution = "";
    let nonceVal = nonce.current;
    while (nonceVal <= Number.MAX_SAFE_INTEGER) {
      candidateSolution = await digestMessage(nonceVal.toString());
      setSolution(candidateSolution);
      setHeader(nonceVal++);

      // stopping condition if first numZero characters are all 0
      if (candidateSolution.substr(0, numZeros).match(/^0+$/)) break;
    }

    const payload = {
      preview: {
        ...state.preview,
        timestamp: Date.now(),
        prevHash: state.chain[state.preview.index - 1].currHash,
        currHash: candidateSolution,
        valid: candidateSolution <= targetHash
      }
    };
    dispatch({ type: ACTIONS.UPDATE_PREVIEW, payload });
    setDisableMineBtn(false);

    // propagate changes if needed
    // if (index && prevHash) await propagateBlockStatus(state, dispatch, index, prevHash, candidateSolution, true);
  }

  return (
    <Form aria-label="Block Statistics" className={props.chain ? "my-3" : "col-11 col-lg-5 mx-3"}>
      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Nonce</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Block Nonce"
          name="nonce"
          type="number"
          key={nonce.current}
          defaultValue={nonce.current}
          disabled
        />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Header</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control aria-label="Block Header" name="header" type="number" value={header} disabled />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Target</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Block Target"
          name="target"
          className="text-truncate"
          type="text"
          value={target}
          readOnly
        />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Sol&apos;n</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Block Solution"
          name="solution"
          className={
            "text-truncate " +
            ((props.chain && props.index && state.chain[props.index].valid) || (!props.chain && state.preview.valid)
              ? "valid-solution"
              : "invalid-solution")
          }
          type="text"
          value={solution}
          readOnly
        />
      </InputGroup>

      <Button
        aria-label="Block Mine"
        variant="primary"
        className="btn-block d-block mt-2"
        disabled={
          (props.chain && props.index && state.chain[props.index].valid) ||
          (!props.chain && state.preview.valid) ||
          (!props.chain && state.selectedTrans.length === 0) ||
          disableMineBtn
        }
        onClick={() => handleMine()}
      >
        <h4 className="my-1">
          Mine
          {disableMineBtn && <span className="position-absolute spinner-border spinner-border-md mx-4" role="status" />}
        </h4>
      </Button>
    </Form>
  );
}
