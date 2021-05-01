import React, { useRef, useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";

import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { copyKey } from "../../utils/copyInput";
import { bufferToHex } from "../../utils/conversion";

import "./User.css";

export default function KeyGeneration(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const publicKeyRef = useRef<HTMLTextAreaElement>(null);
  const privateKeyRef = useRef<HTMLTextAreaElement>(null);

  const numRows = useRef(3);

  const [copied, setCopied] = useState<boolean[]>([false, false]);

  async function CryptoKeyToHex(format: string, key: CryptoKey): Promise<string> {
    const buf = (await window.crypto.subtle.exportKey(format, key)) as ArrayBuffer;
    return bufferToHex(buf);
  }

  async function addUser(): Promise<void> {
    const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"]
    );

    const publicKeyStr = await CryptoKeyToHex("spki", publicKey as CryptoKey);
    const privateKeyStr = await CryptoKeyToHex("pkcs8", privateKey as CryptoKey);
    if (publicKeyRef.current && privateKeyRef.current) {
      publicKeyRef.current.innerText = publicKeyStr;
      privateKeyRef.current.innerText = new Array(privateKeyStr.length).fill("◦").join("");
    }
    localStorage.setItem("user", JSON.stringify({ publicKey: publicKeyStr, privateKey: privateKeyStr, balance: 1000 })); // prettier-ignore

    const newUsers = [...state.users, { publicKey: publicKeyStr, balance: 1000 }];
    localStorage.setItem("users", JSON.stringify(newUsers));
    dispatch({ type: ACTIONS.UPDATE_USERS, payload: { users: newUsers } });
  }

  const togglePrivateKey = () => {
    if (privateKeyRef.current) {
      if (privateKeyRef.current.value.includes("◦")) {
        privateKeyRef.current.value = JSON.parse(localStorage.getItem("user") as string).privateKey;
      } else {
        privateKeyRef.current.value = new Array(privateKeyRef.current.value.length).fill("◦").join("");
      }
    }
  };

  return (
    <div className="container-fluid row d-flex align-items-center justify-content-center mx-auto">
      {!JSON.parse(localStorage.getItem("user") as string)?.publicKey && (
        <Button variant="primary" className="p-3 mx-2 font-weight-bold" onClick={addUser}>
          Create Wallet
        </Button>
      )}
      <Form.Group className="user-key col-5 px-0">
        <Form.Label className="mb-3">
          <h4 className="mb-0">Public:</h4>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={numRows.current}
          defaultValue={localStorage.getItem("user") && JSON.parse(localStorage.getItem("user") as string).publicKey}
          isValid={copied[0]}
          onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => copyKey(e, setCopied, "public")}
          ref={publicKeyRef}
        />
        <Form.Control.Feedback type="valid">Copied to clipboard!</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="user-key col-5 px-0 ml-4">
        <Form.Label className="mb-3">
          <h4 className="mb-0">
            Private:{" "}
            {JSON.parse(localStorage.getItem("user") as string)?.publicKey && (
              <span id="private-reveal-eyes" onClick={togglePrivateKey}>
                👀
              </span>
            )}
          </h4>
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
          ref={privateKeyRef}
        />
        <Form.Control.Feedback type="valid">Copied to clipboard!</Form.Control.Feedback>
      </Form.Group>
    </div>
  );
}
