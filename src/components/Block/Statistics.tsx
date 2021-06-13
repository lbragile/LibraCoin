import React, { useState, useRef, useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, IBlock, IState } from "../../typings/AppTypes";
import { digestMessage, randomHash } from "../../utils/conversion";

import "./Block.scss";
interface IStatisticsProps {
  chain: boolean;
  index: number;
}

export default function Statistics(props: IStatisticsProps): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const nonce = useRef<number>(0);
  const [header, setHeader] = useState<number>(0);
  const [target, setTarget] = useState<string>("");
  const [solution, setSolution] = useState<string>("");
  const [disableMineBtn, setDisableMineBtn] = useState<boolean>(false);

  async function handleMine() {
    const { chain, index } = props;

    setDisableMineBtn(true);
    nonce.current = Math.round(Math.random() * 1e6);

    // make target with 2 or 3 leading zeros
    const numZeros = Math.round(Math.random()) + 2;
    const re = new RegExp(`^.{0,${numZeros}}`, "g");
    const zerosStr = new Array(numZeros).fill("0").join("");
    let targetHash = await digestMessage(randomHash(20));
    targetHash = targetHash.replace(re, zerosStr);
    setTarget(targetHash);

    // mine block for a new current hash (solution)
    let candidateSolution = "";
    let header = nonce.current;
    while (header <= Number.MAX_SAFE_INTEGER) {
      candidateSolution = await digestMessage(header.toString());
      setSolution(candidateSolution);
      setHeader(header++);

      const re = new RegExp(`^0{${numZeros}}`); // exactly numZeros 0 characters at start of string
      if (candidateSolution.match(re)) break;
    }
    setDisableMineBtn(false);

    const timestamp = Date.now();
    const payload = {
      [!chain ? "preview" : "block"]: {
        ...(!chain ? state.preview : state.chain[index]),
        timestamp,
        prevHash: state.chain[(!chain ? state.preview.index : index) - 1].currHash,
        currHash: candidateSolution,
        valid: candidateSolution <= targetHash
      }
    };

    const type = !chain ? ACTIONS.UPDATE_PREVIEW : ACTIONS.UPDATE_BLOCK;
    dispatch({ type, payload });

    // propagate changes to next blocks if in blockchain mode and mined block is not last
    if (chain) {
      const newBlocks: IBlock[] = [];
      let prevHash = candidateSolution;
      let currHash = "";
      for (let i = index + 1; i < state.chain.length; i++) {
        currHash = await digestMessage(i + prevHash + state.chain[i].merkleRoot);
        newBlocks.push({ ...state.chain[i], timestamp, prevHash, currHash, valid: false });
        prevHash = currHash; // next block's prevHash is this block's currHash
      }

      if (newBlocks.length) {
        dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { block: newBlocks } });
      }
    }
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
            ((props.chain && state.chain[props.index].valid) || (!props.chain && state.preview.valid)
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
        className="btn-block mt-2 py-2"
        disabled={
          (props.chain && state.chain[props.index].valid) ||
          (!props.chain && (state.preview.valid || state.selectedTrans.length === 0)) ||
          disableMineBtn
        }
        onClick={() => handleMine()}
      >
        <h4 className="my-0 row justify-content-end flex-nowrap">
          <span className="col-10 pl-5">Mine</span>
          <span
            className={"spinner-border spinner-border-md mr-3 " + (disableMineBtn ? "visible" : "invisible")}
            role="status"
          />
        </h4>
      </Button>
    </Form>
  );
}
