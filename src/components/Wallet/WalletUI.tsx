import React, { useRef, useState } from "react";
import { Chain } from "../../chain";
import UserUI from "../User/UserUI";
import { Wallet } from "../Wallet/Wallet_class";

export default function WalletUI(): JSX.Element {
  const publicKey = useRef<HTMLDivElement>(null);
  const privateKey = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<{ publicKey: string; balance: number }[]>(
    localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users") as string) : []
  );

  const addUser = async () => {
    const user = new Wallet();
    await user.initialize();

    const publicKeyStr = await Wallet.CryptoKeyToHex("spki", user.publicKey);
    const privateKeyStr = await Wallet.CryptoKeyToHex("pkcs8", user.privateKey);
    if (publicKey.current && privateKey.current) {
      publicKey.current.innerText = publicKeyStr;
      privateKey.current.innerText = new Array(privateKeyStr.length).fill("◦").join("");
    }

    Chain.instance.addUser(user);
    const newUsers = [...users, { publicKey: publicKeyStr, balance: user.balance }];
    localStorage.setItem("user", JSON.stringify({ publicKey: publicKeyStr, privateKey: privateKeyStr, balance: user.balance })); // prettier-ignore
    localStorage.setItem("users", JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  const togglePrivateKey = () => {
    if (privateKey.current) {
      if (privateKey.current.innerText.includes("◦")) {
        privateKey.current.innerText = JSON.parse(localStorage.getItem("user") as string).privateKey;
      } else {
        privateKey.current.innerText = new Array(privateKey.current.innerText.length).fill("◦").join("");
      }
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-2">
          <button
            className="btn btn-primary p-3 font-weight-bold"
            disabled={JSON.parse(localStorage.getItem("user") as string)?.publicKey}
            onClick={addUser}
          >
            Create Wallet
          </button>
        </div>
        <div className="col-5">
          <h3 className="user-key">
            <b>Public Key:</b>

            <div className="userKey" ref={publicKey}>
              {localStorage.getItem("user") && JSON.parse(localStorage.getItem("user") as string).publicKey}
            </div>
          </h3>
        </div>
        <div className="col-5">
          <h3 className="user-key">
            <b>Private Key: </b>
            {JSON.parse(localStorage.getItem("user") as string)?.publicKey && (
              <span id="private-reveal-eyes" onClick={togglePrivateKey}>
                👀
              </span>
            )}
            <div className="userKey" ref={privateKey}>
              {localStorage.getItem("user") &&
                new Array(JSON.parse(localStorage.getItem("user") as string).privateKey.length).fill("◦").join("")}
            </div>
          </h3>
        </div>
      </div>

      <UserUI users={users} />
    </div>
  );
}
