import React, { useState, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { IAction, IState, IUser } from "../../typings/AppTypes";
import { copyKey } from "../../utils/copyInput";

import "./User.css";

export default function UserItems(): JSX.Element {
  const { state } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };
  const [copied, setCopied] = useState<boolean[]>([false]);

  return (
    <div className="container-fluid mb-2">
      <h3 className="font-weight-bold"> Users</h3>
      <div id="list-background" className="px-2">
        {state.users?.map((user: IUser) => {
          return (
            <Form className="user-item" key={Math.random()}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Public Key</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  className="text-truncate"
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => copyKey(e, setCopied)}
                  defaultValue={user.publicKey}
                  isValid={copied[0]}
                />
                <Form.Control.Feedback type="valid">Copied to clipboard</Form.Control.Feedback>
              </InputGroup>

              <InputGroup className="mt-2">
                <Form.Control type="number" defaultValue={user.balance.toFixed(2)} disabled={true} />
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
