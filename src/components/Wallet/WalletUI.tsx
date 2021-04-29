import React, { useRef, useState, useContext } from "react";

import { Button, Form } from "react-bootstrap";

import NavbarUI from "../Navbar/NavbarUI";
import TransactionUI from "../Transaction/TransactionUI";
import ItemLineUI from "../ItemLineUI/ItemLineUI";
import { Wallet } from "../Wallet/Wallet_class";

import "./Wallet.css";
import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { ACTIONS } from "../../enums/AppDispatchActions";

export default function WalletUI(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const publicKey = useRef<HTMLTextAreaElement>(null);
  const privateKey = useRef<HTMLTextAreaElement>(null);

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

  function copyPublicKey(e: React.FocusEvent<HTMLTextAreaElement>, type: "public" | "private"): void {
    e.target.select();
    e.target.setSelectionRange(0, 99999);
    document.execCommand("copy");

    const isPublic = type === "public";
    setCopied([isPublic, !isPublic && !e.target.value.includes("◦")]);
  }

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
    <div className="container-fluid my-3">
      <NavbarUI />

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
          <div className="user-key">
            <h3 className="mb-3">Public Key:</h3>
            <Form.Control
              as="textarea"
              rows={7}
              className="userKey"
              defaultValue={
                localStorage.getItem("user") && JSON.parse(localStorage.getItem("user") as string).publicKey
              }
              isValid={copied[0]}
              onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => copyPublicKey(e, "public")}
              ref={publicKey}
            />
            <Form.Control.Feedback type="valid">Copied to clipboard!</Form.Control.Feedback>
          </div>
        </div>
        <div className="col-5">
          <div className="user-key">
            <h3 className="mb-3">
              Private Key:{" "}
              {JSON.parse(localStorage.getItem("user") as string)?.publicKey && (
                <span id="private-reveal-eyes" onClick={togglePrivateKey}>
                  👀
                </span>
              )}
            </h3>
            <Form.Control
              as="textarea"
              rows={7}
              className="userKey"
              defaultValue={
                localStorage.getItem("user")
                  ? new Array(JSON.parse(localStorage.getItem("user") as string).privateKey.length).fill("◦").join("")
                  : ""
              }
              onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => copyPublicKey(e, "private")}
              isValid={copied[1]}
              ref={privateKey}
            />
            <Form.Control.Feedback type="valid">Copied to clipboard!</Form.Control.Feedback>
          </div>
        </div>
      </div>

      <TransactionUI />
      <ItemLineUI title="Users" />
    </div>
  );
}
