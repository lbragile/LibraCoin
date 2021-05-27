import React, { useState, useRef, useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { IAction, IBlock, IState } from "../../typings/AppTypes";
import { mine } from "../../utils/mine";
import { propagateBlockStatus } from "../../utils/propagate";

interface IStats {
  chain: boolean;
  isValid: boolean;
  solution: string;
  setIsValid: (arg: boolean) => void;
  setSolution: (arg: string) => void;
  block?: IBlock;
}

export default function Statistics(props: IStats): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const nonce = useRef<number>();
  const [header, setHeader] = useState<number>();
  const [target, setTarget] = useState<string>();
  const [disableMineBtn, setDisableMineBtn] = useState<boolean>(false);

  async function handleMine() {
    nonce.current = Math.round(Math.random() * 1e6);

    setDisableMineBtn(true);
    const currHash = await mine(nonce.current, setHeader, setTarget, props.setSolution, props.setIsValid);
    setDisableMineBtn(false);

    // propagate changes if needed
    const { chain, block } = props;
    if (chain && block) {
      await propagateBlockStatus(state, dispatch, block.index, block.prevHash, currHash, true);
    }
  }

  return (
    <Form aria-label="Block Statistics" className={props.chain ? "bordered-background" : "col-11 col-lg-5 mx-3"}>
      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Nonce</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          aria-label="Block Nonce"
          name="nonce"
          type="number"
          defaultValue={props.solution ? nonce.current : ""}
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
          name="solution"
          className="text-truncate"
          type="text"
          style={{ color: `${props.isValid ? "green" : "red"}` }}
          defaultValue={props.solution}
          readOnly
        />
      </InputGroup>

      <Button
        aria-label="Block Mine"
        variant="primary"
        className="btn-block d-block mt-2"
        disabled={props.isValid || (!props.chain && state.selectedTrans.length === 0) || disableMineBtn}
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
