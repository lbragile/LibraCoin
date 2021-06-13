import React, { useRef, useState, useContext, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";

import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { copyKey } from "../../utils/copyInput";
import { CryptoKeyToHex } from "../../utils/conversion";

import "./User.scss";

export default function KeyGeneration(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const numRows = useRef(4);

  const [copied, setCopied] = useState<boolean[]>([false, false]);
  const [show, setShow] = useState<boolean>(false);

  // add a user if it's the first time visiting
  useEffect(() => {
    async function addUser(): Promise<void> {
      if (state.user.privateKey === "") {
        const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
          { name: "ECDSA", namedCurve: "P-256" },
          true,
          ["sign", "verify"]
        );

        const publicKeyStr = await CryptoKeyToHex("spki", publicKey as CryptoKey);
        const privateKeyStr = await CryptoKeyToHex("pkcs8", privateKey as CryptoKey);

        const balance = Number(1000).toFixed(2);
        const mainUser = { publicKey: publicKeyStr, privateKey: privateKeyStr, balance };
        dispatch({ type: ACTIONS.SET_MAIN_USER, payload: { user: mainUser } });

        const newUsers = [...state.users, { publicKey: publicKeyStr, balance }];
        dispatch({ type: ACTIONS.UPDATE_USERS, payload: { users: newUsers } });
      }
    }

    addUser();
  }, [dispatch, state.user.privateKey, state.users]);

  return (
    <div className="container-fluid d-flex justify-content-center mx-auto row my-5">
      <InputGroup className="user-key col-12 col-lg-5 pl-3 pl-lg-0">
        <InputGroup.Prepend>
          <InputGroup.Text>Public</InputGroup.Text>
        </InputGroup.Prepend>

        <Form.Control
          aria-label="publicKey"
          as="textarea"
          rows={numRows.current}
          className="rounded-right"
          value={state.user.publicKey}
          isValid={copied[0]}
          onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => copyKey(e, setCopied, "public")}
          onBlur={() => setCopied([false, false])}
          readOnly
        />

        <Form.Control.Feedback type="valid">Copied to clipboard!</Form.Control.Feedback>
      </InputGroup>

      <InputGroup className="user-key col-12 col-lg-5 pl-3">
        <InputGroup.Prepend>
          <InputGroup.Text>Private</InputGroup.Text>
        </InputGroup.Prepend>

        <Form.Control
          aria-label="privateKey"
          as="textarea"
          rows={numRows.current}
          value={show ? state.user.privateKey : new Array(state.user.privateKey.length).fill("◦").join("")}
          onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => copyKey(e, setCopied, "private")}
          onBlur={() => setCopied([false, false])}
          isValid={copied[1]}
          readOnly
        />

        <InputGroup.Append>
          <InputGroup.Text className="rounded-right">
            <span id="private-reveal-eyes" onClick={() => setShow(!show)}>
              👀
            </span>
          </InputGroup.Text>
        </InputGroup.Append>

        <Form.Control.Feedback type="valid">Copied to clipboard!</Form.Control.Feedback>
      </InputGroup>
    </div>
  );
}
