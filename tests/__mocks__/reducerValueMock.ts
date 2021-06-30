import { IState } from "../../src/typings/AppTypes";

const publicKey = "3059301306072a8648ce3d020106082a8648ce3d030107034200048fa7d69599babb";
const privateKey = "308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b020101042047979df7cebe59dd7bf901";

const verifiedTrans = [
  {
    to: "A",
    from: "B",
    amount: 1.23,
    msg: "First Transaction",
    signature: "AB1.23"
  },
  {
    to: "A",
    from: "C",
    amount: 456.78,
    msg: "Second Transaction",
    signature: "AC456.78"
  },
  {
    to: "A",
    from: "D",
    amount: 999.99,
    msg: "Third Transaction",
    signature: "AD999.99"
  },
  {
    to: "A",
    from: "E",
    amount: 987.65,
    msg: "Forth Transaction",
    signature: "AE987.65"
  },
  {
    to: "A",
    from: "F",
    amount: 1.01,
    msg: "Fifth Transaction",
    signature: "AF1.01"
  }
];

const chain = [
  {
    index: 0,
    prevHash: "",
    currHash: new Array(64).fill("0").join(""),
    transactions: [],
    timestamp: Date.parse("31 Apr 2021 00:00:00 UTC"),
    merkleRoot: "",
    valid: true,
    showTrans: false
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
        msg: "Forth Transaction",
        signature: "AE987.65"
      }
    ],
    timestamp: Date.parse("01 May 2021 00:00:00 UTC"),
    merkleRoot: "987.65EForthTransactionAE987.65A",
    valid: true,
    showTrans: false
  },
  {
    index: 2,
    prevHash: new Array(64).fill("A").join(""),
    currHash: new Array(64).fill("Z").join(""),
    transactions: [
      {
        to: "A",
        from: "Z",
        amount: 567.89,
        msg: "Forth Transaction",
        signature: "AZ567.89"
      }
    ],
    timestamp: Date.parse("01 May 2021 00:00:00 UTC"),
    merkleRoot: "567.89ZForthTransactionAZ567.89A",
    valid: false,
    showTrans: true
  }
];

const users = [
  { publicKey, balance: 1000.0 },
  { publicKey: publicKey.slice(0, publicKey.length - 2) + "cd", balance: 111.11 },
  { publicKey: publicKey.slice(0, publicKey.length - 2) + "ef", balance: 222.22 }
];

const preview = {
  index: 3,
  timestamp: Date.parse("02 May 2021 00:00:00 UTC"),
  prevHash: new Array(64).fill("A").join(""),
  currHash: new Array(64).fill("B").join(""),
  transactions: [],
  merkleRoot: "previewMerkle",
  valid: false
};

const wallet = {
  sent: false,
  signed: false,
  validated: false,
  details: { from: "", to: "", amount: 0, msg: "", signature: "" }
};

global.initialState = {
  chain,
  copied: "",
  preview,
  selectedTrans: [verifiedTrans[1]],
  user: { ...users[0], privateKey },
  users,
  verifiedTrans,
  wallet
} as IState;
