import React, { useRef, useState, useContext, useEffect } from "react";
import { Form } from "react-bootstrap";

import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { copyKey } from "../../utils/copyInput";
import { CryptoKeyToHex } from "../../utils/conversion";

import "./User.css";

export default function KeyGeneration(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const numRows = useRef(3);
  const publicKeyRef = useRef<HTMLTextAreaElement>(null);
  const privateKeyRef = useRef<HTMLTextAreaElement>(null);

  const [copied, setCopied] = useState<boolean[]>([false, false]);

  // add a user if it's the first time visiting
  useEffect(() => {
    addUser();
  }, []);

  async function addUser(): Promise<void> {
    if (!JSON.parse(localStorage.getItem("user") as string)?.publicKey) {
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

      const balance = Number(1000).toFixed(2);
      localStorage.setItem("user", JSON.stringify({ publicKey: publicKeyStr, privateKey: privateKeyStr, balance }));

      const newUsers = [...state.users, { publicKey: publicKeyStr, balance }];
      dispatch({ type: ACTIONS.UPDATE_USERS, payload: { users: newUsers } });
    }
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
      <Form.Group className="user-key col-5 px-0">
        <Form.Label className="mb-3" htmlFor="publicKey">
          <h4 className="mb-0">Public:</h4>
        </Form.Label>
        <Form.Control
          aria-label="publicKey"
          as="textarea"
          rows={numRows.current}
          defaultValue={JSON.parse(localStorage.getItem("user") as string)?.publicKey}
          isValid={copied[0]}
          onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => copyKey(e, setCopied, "public")}
          onBlur={() => setCopied([false, false])}
          ref={publicKeyRef}
        />
        <Form.Control.Feedback type="valid">Copied to clipboard!</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="user-key col-5 px-0 ml-4">
        <Form.Label className="mb-3" htmlFor="privateKey">
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
          aria-label="privateKey"
          as="textarea"
          rows={numRows.current}
          defaultValue={
            localStorage.getItem("user")
              ? new Array(JSON.parse(localStorage.getItem("user") as string).privateKey.length).fill("◦").join("")
              : ""
          }
          onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => copyKey(e, setCopied, "private")}
          onBlur={() => setCopied([false, false])}
          isValid={copied[1]}
          ref={privateKeyRef}
        />
        <Form.Control.Feedback type="valid">Copied to clipboard!</Form.Control.Feedback>
      </Form.Group>
    </div>
  );
}
