import React, { useState, useRef, useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { mine } from "../../utils/mine";
import { propagateBlockStatus } from "../../utils/propagate";
import { IBlockProps } from "./Block";

import "./Block.scss";

interface IStatisticsProps extends Omit<IBlockProps, "merkleRoot"> {
  prevHash?: string;
}

export default function Statistics(props: IStatisticsProps): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const nonce = useRef<number>();
  const [header, setHeader] = useState<number>();
  const [target, setTarget] = useState<string>();
  const [disableMineBtn, setDisableMineBtn] = useState<boolean>(false);

  async function handleMine() {
    const { index, prevHash } = props;

    const newIsValid = [...props.isValid];
    const blockIndex = index ?? newIsValid.length - 1;

    nonce.current = Math.round(Math.random() * 1e6);

    setDisableMineBtn(true);
    const { currHash, targetHash } = await mine(nonce.current, blockIndex, setHeader, setTarget, props.solution, props.setSolution); // prettier-ignore
    setDisableMineBtn(false);

    newIsValid[blockIndex] = currHash <= targetHash;
    props.setIsValid(newIsValid);

    // propagate changes if needed
    if (index && prevHash) await propagateBlockStatus(state, dispatch, index, prevHash, currHash, true);
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
          defaultValue={props.solution[props.index ?? 0] ? nonce.current : ""}
          disabled
        />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Header</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control aria-label="Block Header" name="header" type="number" defaultValue={header} disabled />
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
          defaultValue={target}
          readOnly
        />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Sol&apos;n</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Block Solution"
          key={props.solution[props.index ?? 0]}
          name="solution"
          className={"text-truncate " + (props.isValid[props.index ?? 0] ? "valid-solution" : "invalid-solution")}
          type="text"
          defaultValue={props.solution[props.index ?? 0]}
          readOnly
        />
      </InputGroup>

      <Button
        aria-label="Block Mine"
        variant="primary"
        className="btn-block d-block mt-2"
        disabled={
          props.isValid[props.index ?? 0] || (!props.chain && state.selectedTrans.length === 0) || disableMineBtn
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
