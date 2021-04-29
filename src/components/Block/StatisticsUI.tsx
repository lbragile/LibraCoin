import React, { useRef, useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, IState } from "../../typings/AppTypes";
import { Chain } from "../Chain/chain_class";

interface IStats {
  setShowBtn: (arg: boolean) => void;
  setIsValid: (arg: boolean) => void;
  setSolution: (arg: string) => void;
  solution: string;
  isValid: boolean;
  chain: boolean;
  index?: number;
}

export default function StatisticsUI(props: IStats): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const origNonce = useRef<number>();
  const mineBtn = useRef<HTMLButtonElement>(null);
  const [nonce, setNonce] = useState<number>();
  const [target, setTarget] = useState<string>();

  async function handleMine() {
    props.setShowBtn(true);
    props.setIsValid(false);

    let solutionHash = "";

    // make target
    origNonce.current = Math.round(Math.random() * 1e6);
    const numZeros = Math.round(Math.random()) + 2;
    const targetHash = await Chain.instance.createTarget(numZeros);
    setTarget(targetHash);

    // mine
    if (mineBtn.current) {
      mineBtn.current.disabled = true;
      solutionHash = await Chain.instance.mine(origNonce.current, numZeros, setNonce, props.setSolution);
      mineBtn.current.disabled = false;
    }

    if (solutionHash <= targetHash) {
      if (props.index) {
        Chain.instance.blockChain[props.index].currHash = solutionHash;
        localStorage.setItem("chain", JSON.stringify(Chain.instance.blockChain));
      }

      dispatch({ type: ACTIONS.UPDATE_VERIFIED_TRANS });

      Chain.instance.updateBlocksInChain(Chain.instance.blockChain);
      props.setIsValid(true);
    }
  }

  return (
    <div className={props.chain ? "bordered-background" : "col-6 mx-3"}>
      <Form.Group>
        <Form.Label>
          <h5 className="my-0">Nonce:</h5>
        </Form.Label>
        <Form.Control type="number" defaultValue={origNonce.current} disabled={true} />
      </Form.Group>

      <Form.Group>
        <Form.Label>
          <h5 className="my-0">Block Header (Current):</h5>
        </Form.Label>
        <Form.Control type="number" defaultValue={nonce} disabled={true} />
      </Form.Group>

      <Form.Group>
        <Form.Label>
          <h5 className="my-0">Target:</h5>
        </Form.Label>
        <Form.Control type="text" defaultValue={target} disabled={true} />
      </Form.Group>

      <Form.Group>
        <Form.Label>
          <h5 className="my-0">Solution:</h5>
        </Form.Label>
        <Form.Control
          type="text"
          style={props.isValid ? { color: "green" } : { color: "red" }}
          defaultValue={props.solution}
          disabled={true}
        />
      </Form.Group>

      <Button
        variant="primary"
        className="btn-block d-block mt-3"
        disabled={props.isValid || state.selectedTrans.length === 0}
        onClick={() => handleMine()}
        ref={mineBtn}
      >
        <h4 className="m-0">Mine</h4>
      </Button>
    </div>
  );
}
