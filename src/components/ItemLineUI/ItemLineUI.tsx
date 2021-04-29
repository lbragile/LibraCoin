import React, { useState } from "react";

import TransactionLineUI from "./TransactionLineUI";
import UserLineUI from "./UserLineUI";

import "./ItemLineUI.css";
export interface ITransaction {
  to: string;
  from: string;
  amount: number;
  message: string;
  signature?: string;
  index?: number;
}

export default function ItemLineUI({ title }: { title: string }): JSX.Element {
  const [copied, setCopied] = useState(false);

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
          <UserLineUI title={title} copied={copied} copyPublicKey={copyPublicKey} />
        ) : (
          <TransactionLineUI title={title} copied={copied} copyPublicKey={copyPublicKey} />
        )}
      </div>
    </div>
  );
}
