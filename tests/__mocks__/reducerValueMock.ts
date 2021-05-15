import { AppReducer } from "../../src/reducers/AppReducer";
import { IAction, IState } from "../../src/typings/AppTypes";

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
  users: [
    {
      publicKey:
        "3059301306072a8648ce3d020106082a8648ce3d030107034200048fa7d69599babbc58c05cdb2d0676239e9f9958e932d2ebfff03b114582751f1ac63b410382cc2ad467c0cca079d7e4f3dd20aa37642e4b0f7a767f7394e92ab",
      balance: 1000
    }
  ],
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
