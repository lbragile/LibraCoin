import React, { useRef } from "react";
import { Chain } from "../../chain";
import { Wallet } from "../../wallet";

import "./User.css";

export default function UserUI(): JSX.Element {
  const publicKey = useRef<HTMLSpanElement>(null);
  const privateKey = useRef<HTMLSpanElement>(null);

  const addUser = async () => {
    const user = new Wallet();
    await user.initialize();

    const publicKeyStr = Chain.bufferToHex(await window.crypto.subtle.exportKey("spki", user.publicKey));
    const privateKeyStr = Chain.bufferToHex(await window.crypto.subtle.exportKey("pkcs8", user.privateKey));
    if (publicKey.current && privateKey.current) {
      publicKey.current.innerText = publicKeyStr;
      privateKey.current.innerText = privateKeyStr;
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={addUser}>
        Add User
      </button>
      <div className="row">
        <p className="userKey">
          <b>Public:</b>
          <span className="userKey" ref={publicKey}></span>
        </p>
        <p className="userKey">
          <b>Private:</b>
          <span className="userKey" ref={privateKey}></span>
        </p>
      </div>
    </div>
  );
}
