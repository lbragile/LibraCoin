import { ACTIONS } from "../../../src/enums/AppDispatchActions";
import { AppReducer } from "../../../src/reducers/AppReducer";
import { IBlock, ITransaction, IUser } from "../../../src/typings/AppTypes";

const { state } = global;

describe("Testing each reducer case", () => {
  describe("VERIFIED TRANSACTION ACTIONS", () => {
    const trans: ITransaction = {
      to: "B",
      from: "C",
      amount: 4.56,
      message: "Second Transaction",
      signature: "EFGH"
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

    test("ACTIONS.ADD_VERIFIED_TRANS", () => {
      const ogState = JSON.parse(JSON.stringify(state));
      const output = AppReducer(ogState, { type: ACTIONS.ADD_VERIFIED_TRANS, payload: { trans } });
      expect(output.verifiedTrans).toStrictEqual([...ogState.verifiedTrans, trans]);
    });

    test("ACTIONS.UPDATE_VERIFIED_TRANS (no match)", () => {
      const ogState = JSON.parse(JSON.stringify(state));

      // selected not in verified list
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

    test("ACTIONS.UPDATE_SELECTED_TRANS", () => {
      const ogState = JSON.parse(JSON.stringify(state));

      const output = AppReducer(ogState, { type: ACTIONS.UPDATE_SELECTED_TRANS, payload: { selectedTrans: [trans] } });
      expect(output.selectedTrans).toStrictEqual([trans]);
    });

    test("ACTIONS.UPDATE_USERS", () => {
      const ogState = JSON.parse(JSON.stringify(state));

      const output = AppReducer(ogState, { type: ACTIONS.UPDATE_USERS, payload: { users } });
      expect(output.users).toStrictEqual(users);
    });

    test("ACTIONS.ADD_BLOCK", () => {
      const ogState = JSON.parse(JSON.stringify(state));

      const output = AppReducer(ogState, { type: ACTIONS.ADD_BLOCK, payload: { block } });
      expect(output.chain).toStrictEqual([...ogState.chain, block]);
    });

    test("ACTIONS.UPDATE_BLOCK", () => {
      const ogState = JSON.parse(JSON.stringify(state));
      block.index = 0;

      const output = AppReducer(ogState, { type: ACTIONS.UPDATE_BLOCK, payload: { block } });
      ogState.chain[0] = block;
      expect(output.chain).toStrictEqual(ogState.chain);
    });

    test("Random action type that doesn't exist", () => {
      const ogState = JSON.parse(JSON.stringify(state));

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /* @ts-ignore */
      expect(AppReducer(ogState, { type: "XYZ" })).toStrictEqual(ogState);
    });
  });
});
