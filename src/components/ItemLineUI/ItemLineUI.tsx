import React, { useState } from "react";

import TransactionLineUI from "./TransactionLineUI";
import UserLineUI from "./UserLineUI";

import "./ItemLineUI.css";

interface IUser {
  publicKey: string;
  balance: number;
  index?: number;
}

interface ITransaction {
  to: string;
  from: string;
  amount: number;
  message: string;
  signature?: string;
  index?: number;
}

export default function ItemLineUI({
  details,
  title,
}: {
  details: IUser[] | ITransaction[];
  title: string;
}): JSX.Element {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  function showUserDetails(
    boxDetail: IUser | ITransaction,
    index: number,
    modalText: React.MutableRefObject<IUser | ITransaction>
  ): void {
    modalText.current = { ...boxDetail, index };
    setShow(true);
  }

  function copyPublicKey(e: React.FocusEvent<HTMLInputElement>): void {
    e.target.select();
    e.target.setSelectionRange(0, 1e6);
    document.execCommand("copy");
    setCopied(true);
  }

  return (
    <div>
      <div>
        {title.toLowerCase().includes("user") ? (
          <UserLineUI details={details as IUser[]} title={title} copied={copied} copyPublicKey={copyPublicKey} />
        ) : (
          <TransactionLineUI
            details={details as ITransaction[]}
            title={title}
            show={show}
            setShow={setShow}
            showUserDetails={showUserDetails}
            copied={copied}
            copyPublicKey={copyPublicKey}
          />
        )}
      </div>
    </div>
  );
}
