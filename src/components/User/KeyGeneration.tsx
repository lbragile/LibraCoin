import React, { useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

import { useAddUser } from "../../hooks/useAddUser";
import { useAppContext } from "../../hooks/useAppContext";
import { copyInput, removeCopied } from "../../utils/copyInput";

import "./User.scss";

export default function KeyGeneration(): JSX.Element {
  const { state, dispatch } = useAppContext();

  const numRows = useRef(4);
  const [show, setShow] = useState<boolean>(false);

  useAddUser(state.user.publicKey, state.users);

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
          isValid={state.copied === "walletPK"}
          onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => copyInput(e.target, "walletPK", dispatch)}
          onBlur={() => removeCopied(dispatch)}
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
          onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => copyInput(e.target, "walletSK", dispatch)}
          onBlur={() => removeCopied(dispatch)}
          isValid={state.copied === "walletSK"}
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
