import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useAppContext } from "../../hooks/useAppContext";
import { StyledInputGroupText } from "../../styles/GlobalStyles";
import { UserItem } from "../../styles/UserStyles";
import { IUser } from "../../typings/AppTypes";
import { copyInput, removeCopied } from "../../utils/copyInput";

export default function UserItems(): JSX.Element {
  const { state, dispatch } = useAppContext();

  return (
    <div className="container-fluid mb-2">
      <h3 className="font-weight-bold">Users</h3>
      <div className="row flex-nowrap overflow-auto bg-dark mx-1 px-2 rounded">
        {state.users.map((user: IUser, i: number) => {
          return (
            <UserItem className="rounded flex-shrink-0" key={`user-${user.publicKey}`}>
              <InputGroup>
                <InputGroup.Prepend>
                  <StyledInputGroupText>🔑</StyledInputGroupText>
                </InputGroup.Prepend>
                <Form.Control
                  aria-label="User Public Key"
                  type="text"
                  className="text-truncate rounded-right"
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => copyInput(e.target, "userItem-" + i, dispatch)}
                  onBlur={() => removeCopied(dispatch)}
                  defaultValue={user.publicKey}
                  isValid={state.copied === "userItem-" + i}
                  readOnly
                />
                <Form.Control.Feedback type="valid">Copied to clipboard</Form.Control.Feedback>
              </InputGroup>

              <InputGroup className="mt-2">
                <Form.Control aria-label="balance" type="number" defaultValue={user.balance} disabled />
                <InputGroup.Append>
                  <StyledInputGroupText>LC</StyledInputGroupText>
                </InputGroup.Append>
              </InputGroup>
            </UserItem>
          );
        })}
      </div>
    </div>
  );
}
