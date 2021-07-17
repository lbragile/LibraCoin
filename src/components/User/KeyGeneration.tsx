import React, { useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

import { useAddUser } from "../../hooks/useAddUser";
import { useAppContext } from "../../hooks/useAppContext";
import { RevealEyes, UserKey } from "../../styles/UserStyles";
import { copyInput, removeCopied } from "../../utils/copyInput";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";

export default function KeyGeneration(): JSX.Element {
  const { state, dispatch } = useAppContext();

  const numRows = useRef(3);
  const [show, setShow] = useState<boolean>(false);

  useAddUser(state.user.privateKey, state.users);

  return (
    <div className="container col-11 col-lg-8 justify-content-center my-5 bg-dark rounded p-2">
      <UserKey className="mx-auto">
        <InputGroup.Prepend>
          <InputGroup.Text>Public Key (PK)</InputGroup.Text>
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
      </UserKey>

      <UserKey className="mx-auto">
        <InputGroup.Prepend>
          <InputGroup.Text>Private Key (SK)</InputGroup.Text>
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
            <RevealEyes role="img" aria-label="Key Reveal Eye" onClick={() => setShow(!show)}>
              {show ? <EyeSlashFill /> : <EyeFill />}{" "}
            </RevealEyes>
          </InputGroup.Text>
        </InputGroup.Append>

        <Form.Control.Feedback type="valid">Copied to clipboard!</Form.Control.Feedback>
      </UserKey>
    </div>
  );
}
