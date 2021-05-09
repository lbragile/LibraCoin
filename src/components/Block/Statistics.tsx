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
  details?: IBlock;
}

export default function Statistics(props: IStats): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const nonce = useRef<number>();
  const [header, setHeader] = useState<number>();
  const [target, setTarget] = useState<string>();

  async function handleMine() {
    nonce.current = Math.round(Math.random() * 1e6);
    const hash = await mine(nonce.current, setHeader, setTarget, props.setSolution, props.setIsValid);
    if (props.chain && props.details) {
      await propagateBlockStatus(state, dispatch, props.details, hash, true);
    }
  }

  return (
    <div className={props.chain ? "bordered-background" : "col-11 col-lg-5 mx-3"}>
      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Nonce</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control type="number" defaultValue={props.solution ? nonce.current : ""} disabled={true} />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Header</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control type="number" defaultValue={header} disabled={true} />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text className="font-weight-bold">Target</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control type="text" defaultValue={target} disabled={true} />
      </InputGroup>

      <InputGroup className="my-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Sol&apos;n</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          type="text"
          style={props.isValid ? { color: "green" } : { color: "red" }}
          defaultValue={props.solution}
          disabled={true}
        />
      </InputGroup>

      <Button
        variant="primary"
        className="btn-block d-block mt-3"
        disabled={props.isValid || (!props.chain && state.selectedTrans.length === 0)}
        onClick={() => handleMine()}
      >
        <h4 className="m-0">Mine</h4>
      </Button>
    </div>
  );
}
