import React, { useState, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { IAction, IState, IUser } from "../../typings/AppTypes";
import { copyKey } from "../../utils/copyInput";

import "./User.scss";

export default function UserItems(): JSX.Element {
  const { state } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };
  const [copied, setCopied] = useState<boolean[]>(new Array(state.users.length).fill(false));

  function resetCopy(index: number): void {
    const newCopied = JSON.parse(JSON.stringify(copied));
    newCopied[index] = false;
    setCopied(newCopied);
  }

  return (
    <div className="container-fluid mb-2">
      <h3 className="font-weight-bold">Users</h3>
      <div className="row flex-nowrap overflow-auto bg-dark mx-1 px-2 rounded">
        {state.users?.map((user: IUser, i: number) => {
          return (
            <Form className="user-item rounded flex-shrink-0" key={`user-${user.publicKey}`}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>🔑</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  aria-label="User Public Key"
                  type="text"
                  className="text-truncate rounded-right"
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                    copyKey(e, setCopied, undefined, i, state.users.length)
                  }
                  onBlur={() => resetCopy(i)}
                  defaultValue={user.publicKey}
                  isValid={copied[i]}
                  readOnly
                />
                <Form.Control.Feedback type="valid">Copied to clipboard</Form.Control.Feedback>
              </InputGroup>

              <InputGroup className="mt-2">
                <Form.Control aria-label="balance" type="number" defaultValue={user.balance} disabled />
                <InputGroup.Append>
                  <InputGroup.Text>LC</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          );
        })}
      </div>
    </div>
  );
}
