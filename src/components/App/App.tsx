import React, { useEffect, useState } from "react";

import { Wallet } from "../Wallet/Wallet_class";
import { Chain } from "../../chain";
import { Block } from "../Block/block_class";
import BlockUI from "../Block/BlockUI";
import UserUI from "../User/UserUI";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import WalletUI from "../Wallet/WalletUI";

export default function App(): JSX.Element {
  // const [blockChain, setBlockChain] = useState<Block[]>(Chain.instance.blockChain);

  // useEffect(() => {
  //   async function main(): Promise<void> {
  //     const lior = new Wallet();
  //     await lior.initialize();

  //     const bamba = new Wallet();
  //     await bamba.initialize();

  //     const anon = new Wallet();
  //     await anon.initialize();

  //     // first 2 transactions
  //     await lior.sendMoney(1e3, bamba.publicKey, "Good dog gets money");
  //     await anon.sendMoney(1e6, bamba.publicKey, "Be rich Bamba");

  //     // next 2 transactions
  //     await anon.sendMoney(10, lior.publicKey, "You deserve this much");
  //     await lior.sendMoney(1, anon.publicKey, "Thank you");

  //     // last transaction
  //     await bamba.sendMoney(1, lior.publicKey, "I am rich 😀🐶");
  //     await lior.sendMoney(1, bamba.publicKey);

  //     setBlockChain(Chain.instance.blockChain);
  //   }

  //   main();
  // }, []);

  return (
    <div className="container-fluid my-3">
      <WalletUI />
      {/* <BlockUI details={blockChain} /> */}
    </div>
  );
}
