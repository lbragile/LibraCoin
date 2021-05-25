import { ACTIONS } from "../../../src/enums/AppDispatchActions";
import { AppReducer } from "../../../src/reducers/AppReducer";
import { IBlock, ITransaction, IUser } from "../../../src/typings/AppTypes";

const { state } = global;

const trans: ITransaction = {
  to: "B",
  from: "C",
  amount: 4.56,
  message: "Sixth Transaction",
  signature: "BC4.56"
};

const users: IUser[] = [
  {
    balance: 100.11,
    publicKey: "LibraCoinKey"
  }
];

const block: IBlock = {
  index: 1,
  prevHash: new Array(64).fill("0").join(""),
  currHash: new Array(64).fill("1").join(""),
  transactions: [trans],
  timestamp: Date.parse("05/15/2021"),
  merkleRoot: "abcdedcba"
};

describe("VERIFIED TRANSACTION", () => {
  test("ACTIONS.ADD_VERIFIED_TRANS", () => {
    const ogState = JSON.parse(JSON.stringify(state));
    const expectedOutput = [...ogState.verifiedTrans, trans];

    const output = AppReducer(ogState, { type: ACTIONS.ADD_VERIFIED_TRANS, payload: { trans } });
    expect(output.verifiedTrans).toStrictEqual(expectedOutput);
  });

  test("ACTIONS.UPDATE_VERIFIED_TRANS (no match)", () => {
    const ogState = JSON.parse(JSON.stringify(state));

    // selected not in verified list
    ogState.selectedTrans = [];
    ogState.selectedTrans.push(trans);

    const output = AppReducer(ogState, { type: ACTIONS.UPDATE_VERIFIED_TRANS });
    expect(output.verifiedTrans).toStrictEqual(ogState.verifiedTrans);
  });

  test("ACTIONS.UPDATE_VERIFIED_TRANS (match at least 1)", () => {
    const ogState = JSON.parse(JSON.stringify(state));

    // select existing transaction and new transaction
    ogState.selectedTrans.push(...ogState.verifiedTrans);
    ogState.verifiedTrans.push(trans);

    const output = AppReducer(ogState, { type: ACTIONS.UPDATE_VERIFIED_TRANS });
    expect(output.verifiedTrans).toStrictEqual([trans]);
  });
});

describe("SELECTED TRANSACTION", () => {
  test("ACTIONS.UPDATE_SELECTED_TRANS", () => {
    const ogState = JSON.parse(JSON.stringify(state));

    const output = AppReducer(ogState, { type: ACTIONS.UPDATE_SELECTED_TRANS, payload: { selectedTrans: [trans] } });
    expect(output.selectedTrans).toStrictEqual([trans]);
  });
});

describe("USERS", () => {
  test("ACTIONS.UPDATE_USERS", () => {
    const ogState = JSON.parse(JSON.stringify(state));

    const output = AppReducer(ogState, { type: ACTIONS.UPDATE_USERS, payload: { users } });
    expect(output.users).toStrictEqual(users);
  });
});

describe("BLOCK", () => {
  test("ACTIONS.ADD_BLOCK", () => {
    const ogState = JSON.parse(JSON.stringify(state));
    const expectedOutput = [...ogState.chain, block];

    const output = AppReducer(ogState, { type: ACTIONS.ADD_BLOCK, payload: { block } });
    expect(output.chain).toStrictEqual(expectedOutput);
  });

  test("ACTIONS.UPDATE_BLOCK", () => {
    const ogState = JSON.parse(JSON.stringify(state));
    localStorage.setItem("chain", JSON.stringify(ogState.chain));

    // update timestamp of block at index 0
    block.index = 0;
    block.timestamp = Date.parse("05/15/2021");

    const output = AppReducer(ogState, { type: ACTIONS.UPDATE_BLOCK, payload: { block } });
    ogState.chain[0] = block;
    expect(output.chain).toStrictEqual(ogState.chain);
  });
});

describe("RANDOM", () => {
  test("action type that doesn't exist", () => {
    const ogState = JSON.parse(JSON.stringify(state));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /* @ts-ignore */
    expect(AppReducer(ogState, { type: "XYZ" })).toStrictEqual(ogState);
  });
});
