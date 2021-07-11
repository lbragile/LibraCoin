import React, { useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

import { useAddUser } from "../../hooks/useAddUser";
import { useAppContext } from "../../hooks/useAppContext";
import { StyledInputGroupText } from "../../styles/GlobalStyles";
import { RevealEyes, UserKey } from "../../styles/UserStyles";
import { copyInput, removeCopied } from "../../utils/copyInput";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";

export default function KeyGeneration(): JSX.Element {
  const { state, dispatch } = useAppContext();

  const numRows = useRef(3);
  const [show, setShow] = useState<boolean>(false);

  useAddUser(state.user.publicKey, state.users);

  return (
    <div className="container-fluid d-flex justify-content-center mx-auto row my-5">
      <UserKey className="col-12 col-lg-8">
        <InputGroup.Prepend>
          <StyledInputGroupText>Public Key (PK)</StyledInputGroupText>
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

      <UserKey className="col-12 col-lg-8">
        <InputGroup.Prepend>
          <StyledInputGroupText>Private Key (SK)</StyledInputGroupText>
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
          <StyledInputGroupText className="rounded-right">
            <RevealEyes role="img" aria-label="Key Reveal Eye" onClick={() => setShow(!show)}>
              {show ? <EyeSlashFill /> : <EyeFill />}{" "}
            </RevealEyes>
          </StyledInputGroupText>
        </InputGroup.Append>

        <Form.Control.Feedback type="valid">Copied to clipboard!</Form.Control.Feedback>
      </UserKey>
    </div>
  );
}
