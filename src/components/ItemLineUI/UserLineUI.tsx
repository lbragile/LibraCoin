import React, { useContext } from "react";
import { Form } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";

interface IUser {
  publicKey: string;
  balance: number;
  index?: number;
}

interface IUserLineProps {
  title: string;
  copied: boolean;
  copyPublicKey: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function UserLineUI({ title, copied, copyPublicKey }: IUserLineProps): JSX.Element {
  const { state } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  return (
    <div>
      <div>
        <h3>
          <b>{title}:</b>
        </h3>
        <div id="list-background">
          {state.users?.map((boxDetail: IUser) => {
            return (
              <Form className="item" key={Math.random()}>
                <Form.Group>
                  <Form.Label>
                    <h5 className={copied ? "my-0" : "mt-1"}>Public Key:</h5>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="text-truncate"
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => copyPublicKey(e)}
                    defaultValue={boxDetail.publicKey}
                    isValid={copied}
                  />
                  <Form.Control.Feedback type="valid">Copied to clipboard</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label>
                    <h5 className="my-0">Balance:</h5>
                  </Form.Label>
                  <p>{boxDetail.balance.toFixed(2)} LC</p>
                </Form.Group>
              </Form>
            );
          })}
        </div>
      </div>
    </div>
  );
}
