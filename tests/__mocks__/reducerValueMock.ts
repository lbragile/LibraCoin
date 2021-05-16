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
      signature: "ABCD"
    }
  ],
  selectedTrans: [],
  users: [{ publicKey, balance: 1000 }],
  user: { publicKey, privateKey, balance: 1000 },
  chain: [
    {
      index: 0,
      prevHash: "",
      currHash: new Array(64).fill("0").join(""),
      transactions: [],
      timestamp: Date.parse("04/31/2021"),
      merkleRoot: ""
    }
  ]
};

const dispatch = (action: IAction) => AppReducer(state, action);

global.state = state;
global.dispatch = dispatch;
