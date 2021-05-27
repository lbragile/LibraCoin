import { AppReducer } from "../../src/reducers/AppReducer";
import { IAction, IState } from "../../src/typings/AppTypes";

const publicKey = "3059301306072a8648ce3d020106082a8648ce3d030107034200048fa7d69599babb";
const privateKey = "308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b020101042047979df7cebe59dd7bf901";

const state: IState = {
  verifiedTrans: [
    {
      to: "A",
      from: "B",
      amount: 1.23,
      message: "First Transaction",
      signature: "AB1.23"
    },
    {
      to: "A",
      from: "C",
      amount: 456.78,
      message: "Second Transaction",
      signature: "AC456.78"
    },
    {
      to: "A",
      from: "D",
      amount: 999.99,
      message: "Third Transaction",
      signature: "AD999.99"
    },
    {
      to: "A",
      from: "E",
      amount: 987.65,
      message: "Forth Transaction",
      signature: "AE987.65"
    },
    {
      to: "A",
      from: "F",
      amount: 1.01,
      message: "Fifth Transaction",
      signature: "AF1.01"
    }
  ],
  selectedTrans: [
    {
      to: "A",
      from: "C",
      amount: 456.78,
      message: "Second Transaction",
      signature: "AC456.78"
    }
  ],
  users: [
    { publicKey, balance: 1000.0 },
    { publicKey: publicKey.slice(0, publicKey.length - 2) + "cd", balance: 111.11 },
    { publicKey: publicKey.slice(0, publicKey.length - 2) + "ef", balance: 222.22 }
  ],
  user: { publicKey, privateKey, balance: 1000 },
  chain: [
    {
      index: 0,
      prevHash: "",
      currHash: new Array(64).fill("0").join(""),
      transactions: [],
      timestamp: Date.parse("04/31/2021"),
      merkleRoot: ""
    },
    {
      index: 1,
      prevHash: new Array(64).fill("0").join(""),
      currHash: new Array(64).fill("A").join(""),
      transactions: [
        {
          to: "A",
          from: "E",
          amount: 987.65,
          message: "Forth Transaction",
          signature: "AE987.65"
        }
      ],
      timestamp: Date.parse("05/01/2021"),
      merkleRoot: "987.65EForthTransactionAE987.65A"
    }
  ]
};

const dispatch = (action: IAction) => AppReducer(state, action);

global.state = state;
global.dispatch = dispatch;
