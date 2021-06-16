/**
 * @group reducers
 */

import { ACTIONS } from "../../src/enums/AppDispatchActions";
import { AppReducer } from "../../src/reducers/AppReducer";
import { IBlock, IMainUser, ITransaction, IUser } from "../../src/typings/AppTypes";

const { initialState } = global;

const trans: ITransaction = {
  to: "B",
  from: "C",
  amount: 4.56,
  message: "Sixth Transaction",
  signature: "BC4.56"
};

const user: IMainUser = { publicKey: "newPK", privateKey: "newSK", balance: 101.01 };
const users: IUser[] = [{ balance: 100.11, publicKey: "LibraCoinKey" }];

const block: IBlock = {
  index: 1,
  prevHash: new Array(64).fill("0").join(""),
  currHash: new Array(64).fill("1").join(""),
  transactions: [trans],
  timestamp: Date.parse("15 May 2021 00:00:00 UTC"),
  merkleRoot: "abcdedcba",
  valid: true
};

describe("VERIFIED TRANSACTION", () => {
  test("ACTIONS.ADD_VERIFIED_TRANS", () => {
    const output = AppReducer(initialState, { type: ACTIONS.ADD_VERIFIED_TRANS, payload: { trans } });
    expect(output).toStrictEqual({ ...initialState, verifiedTrans: [...initialState.verifiedTrans, trans] });
  });

  test("ACTIONS.UPDATE_VERIFIED_TRANS (no match)", () => {
    const output = AppReducer({ ...initialState, selectedTrans: [trans] }, { type: ACTIONS.UPDATE_VERIFIED_TRANS });
    expect(output).toStrictEqual({ ...initialState, selectedTrans: [trans] });
  });

  test("ACTIONS.UPDATE_VERIFIED_TRANS (match at least 1)", () => {
    // select existing transaction and new transaction
    const output = AppReducer(
      {
        ...initialState,
        selectedTrans: [...initialState.selectedTrans, ...initialState.verifiedTrans],
        verifiedTrans: [...initialState.verifiedTrans, trans]
      },
      { type: ACTIONS.UPDATE_VERIFIED_TRANS }
    );
    expect(output).toStrictEqual({
      ...initialState,
      selectedTrans: [...initialState.selectedTrans, ...initialState.verifiedTrans],
      verifiedTrans: [trans]
    });
  });
});

test("ACTIONS.UPDATE_SELECTED_TRANS", () => {
  const output = AppReducer(initialState, { type: ACTIONS.UPDATE_SELECTED_TRANS, payload: { selectedTrans: [trans] } }); // prettier-ignore
  expect(output).toStrictEqual({ ...initialState, selectedTrans: [trans] });
});

describe("USERS", () => {
  test("ACTIONS.UPDATE_USERS", () => {
    const output = AppReducer(initialState, { type: ACTIONS.UPDATE_USERS, payload: { users } });
    expect(output).toStrictEqual({ ...initialState, users });
  });

  test("ACTIONS.SET_MAIN_USER", () => {
    const output = AppReducer(initialState, { type: ACTIONS.SET_MAIN_USER, payload: { user } });
    expect(output).toStrictEqual({ ...initialState, user });
  });
});

describe("BLOCK", () => {
  test("ACTIONS.ADD_BLOCK", () => {
    const output = AppReducer(initialState, { type: ACTIONS.ADD_BLOCK, payload: { block } });
    expect(output).toStrictEqual({ ...initialState, chain: [...initialState.chain, block] });
  });

  test("ACTIONS.UPDATE_BLOCK - single", () => {
    // update timestamp of block at index 1
    const newBlock = { ...block };
    newBlock.index = 1;
    newBlock.timestamp = Date.parse("15 May 2021 00:00:00 UTC");

    // expected updated chain
    const chain = [...initialState.chain];
    chain[1] = newBlock;

    const output = AppReducer(initialState, { type: ACTIONS.UPDATE_BLOCK, payload: { block: newBlock } });
    expect(output).toStrictEqual({ ...initialState, chain });
  });

  test("ACTIONS.UPDATE_BLOCK - multiple", () => {
    // update timestamp of blocks at index 1 & 2
    const firstBlock = { ...block };
    firstBlock.index = 1;
    firstBlock.timestamp = Date.parse("15 May 2021 00:00:00 UTC");

    const secondBlock = { ...firstBlock };
    secondBlock.index = 2;
    secondBlock.timestamp = Date.parse("15 May 2021 00:00:00 UTC");

    // expected updated chain
    const chain = [...initialState.chain];
    chain[1] = firstBlock;
    chain[2] = secondBlock;

    const output = AppReducer(initialState, {
      type: ACTIONS.UPDATE_BLOCK,
      payload: { block: [firstBlock, secondBlock] }
    });
    expect(output).toStrictEqual({ ...initialState, chain });
  });

  test("ACTIONS.UPDATE_PREVIEW", () => {
    // update timestamp of block at index 5
    const newPreview = { ...block };
    newPreview.index = 5;
    newPreview.timestamp = Date.parse("14 Jun 2021 00:00:00 UTC");

    const output = AppReducer(initialState, { type: ACTIONS.UPDATE_PREVIEW, payload: { preview: newPreview } });
    expect(output).toStrictEqual({ ...initialState, preview: newPreview });
  });
});

test("ACTIONS.ASSIGN_COPIED", () => {
  const output = AppReducer(initialState, { type: ACTIONS.ASSIGN_COPIED, payload: { copied: "randomString" } });
  expect(output).toStrictEqual({ ...initialState, copied: "randomString" });
});

test("ACTIONS.RANDOM - random action type that doesn't exist", () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  expect(AppReducer(initialState, { type: "XYZ" })).toStrictEqual(initialState);
});
