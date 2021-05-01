import React, { useState, useContext } from "react";
import { Form } from "react-bootstrap";
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
      <div id="list-background">
        {state.users?.map((user: IUser) => {
          return (
            <Form className="item" key={Math.random()}>
              <Form.Group>
                <Form.Label>
                  <h5 className={copied ? "my-0" : "mt-1"}>Public Key:</h5>
                </Form.Label>
                <Form.Control
                  type="text"
                  className="text-truncate"
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => copyKey(e, setCopied)}
                  defaultValue={user.publicKey}
                  isValid={copied[0]}
                />
                <Form.Control.Feedback type="valid">Copied to clipboard</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  <h5 className="my-0">Balance:</h5>
                </Form.Label>
                <p>{user.balance.toFixed(2)} LC</p>
              </Form.Group>
            </Form>
          );
        })}
      </div>
    </div>
  );
}
