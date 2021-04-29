import React, { useRef, useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";

import { Wallet } from "../Wallet/Wallet_class";
import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { copyKey } from "../../utils/copyInput";

import "./Wallet.css";

export default function KeyGeneration(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const publicKey = useRef<HTMLTextAreaElement>(null);
  const privateKey = useRef<HTMLTextAreaElement>(null);

  const numRows = useRef(4);

  const [copied, setCopied] = useState<boolean[]>([false, false]);

  const addUser = async () => {
    const user = new Wallet();
    await user.initialize();

    const publicKeyStr = await Wallet.CryptoKeyToHex("spki", user.publicKey);
    const privateKeyStr = await Wallet.CryptoKeyToHex("pkcs8", user.privateKey);
    if (publicKey.current && privateKey.current) {
      publicKey.current.innerText = publicKeyStr;
      privateKey.current.innerText = new Array(privateKeyStr.length).fill("◦").join("");
    }

    const newUsers = [...state.users, { publicKey: publicKeyStr, balance: user.balance }];
    localStorage.setItem("user", JSON.stringify({ publicKey: publicKeyStr, privateKey: privateKeyStr, balance: user.balance })); // prettier-ignore
    localStorage.setItem("users", JSON.stringify(newUsers));
    dispatch({ type: ACTIONS.UPDATE_USERS, payload: { users: newUsers } });
  };

  const togglePrivateKey = () => {
    if (privateKey.current) {
      if (privateKey.current.value.includes("◦")) {
        privateKey.current.value = JSON.parse(localStorage.getItem("user") as string).privateKey;
      } else {
        privateKey.current.value = new Array(privateKey.current.value.length).fill("◦").join("");
      }
    }
  };

  return (
    <div className="row">
      {!JSON.parse(localStorage.getItem("user") as string)?.publicKey ? (
        <div className="col-2">
          <Button variant="primary" className="p-3 font-weight-bold" onClick={addUser}>
            Create Wallet
          </Button>
        </div>
      ) : (
        <div className="col-1"></div>
      )}
      <div className="col-5">
        <Form.Group className="user-key">
          <Form.Label className="mb-3">
            <h3>Public Key:</h3>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={numRows.current}
            defaultValue={localStorage.getItem("user") && JSON.parse(localStorage.getItem("user") as string).publicKey}
            isValid={copied[0]}
            onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => copyKey(e, setCopied, "public")}
            ref={publicKey}
          />
          <Form.Control.Feedback type="valid">Copied to clipboard!</Form.Control.Feedback>
        </Form.Group>
      </div>
      <div className="col-5">
        <Form.Group className="user-key">
          <Form.Label className="mb-3">
            <h3>
              Private Key:{" "}
              {JSON.parse(localStorage.getItem("user") as string)?.publicKey && (
                <span id="private-reveal-eyes" onClick={togglePrivateKey}>
                  👀
                </span>
              )}
            </h3>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={numRows.current}
            defaultValue={
              localStorage.getItem("user")
                ? new Array(JSON.parse(localStorage.getItem("user") as string).privateKey.length).fill("◦").join("")
                : ""
            }
            onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => copyKey(e, setCopied, "private")}
            isValid={copied[1]}
            ref={privateKey}
          />
          <Form.Control.Feedback type="valid">Copied to clipboard!</Form.Control.Feedback>
        </Form.Group>
      </div>
    </div>
  );
}
