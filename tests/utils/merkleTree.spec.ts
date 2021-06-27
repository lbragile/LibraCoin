/**
 * @group utils
 */

import { calculateMerkleTreeFormation, flattenTree, getMerkleRoot } from "../../src/utils/merkleTree";
import * as ConversionUtil from "../../src/utils/conversion";

const { initialState } = global;
let tree: string[][];

beforeEach(() => (tree = [["d", "e", "f", "g"], ["b", "c"], ["a"]]));

describe("calculateMerkleTreeFormation", () => {
  test("no selected transactions", async () => {
    expect(await calculateMerkleTreeFormation(initialState.verifiedTrans, [])).toStrictEqual([[""]]);
  });

  test("1 selected transactions", async () => {
    const { verifiedTrans } = initialState;
    expect(await calculateMerkleTreeFormation(verifiedTrans, [verifiedTrans[0]])).toStrictEqual([
      [verifiedTrans[0].signature]
    ]);
  });

  test("2 selected transactions", async () => {
    const { verifiedTrans } = initialState;

    jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce("ABC");
    expect(await calculateMerkleTreeFormation(verifiedTrans, [...verifiedTrans.slice(0, 2)])).toStrictEqual([
      [verifiedTrans[0].signature, verifiedTrans[1].signature],
      ["ABC"]
    ]);
  });

  test("3 selected transactions", async () => {
    const { verifiedTrans } = initialState;

    jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce("ABC").mockResolvedValueOnce("DEF");
    expect(await calculateMerkleTreeFormation(verifiedTrans, [...verifiedTrans.slice(0, 3)])).toStrictEqual([
      [...verifiedTrans.slice(0, 3).map((trans) => trans.signature)],
      ["ABC", verifiedTrans[2].signature],
      ["DEF"]
    ]);
  });

  test("4 selected transactions", async () => {
    const { verifiedTrans } = initialState;

    jest
      .spyOn(ConversionUtil, "digestMessage")
      .mockResolvedValueOnce("ABC")
      .mockResolvedValueOnce("DEF")
      .mockResolvedValueOnce("GHI");

    expect(await calculateMerkleTreeFormation(verifiedTrans, [...verifiedTrans.slice(0, 4)])).toStrictEqual([
      [...verifiedTrans.slice(0, 4).map((trans) => trans.signature)],
      ["ABC", "DEF"],
      ["GHI"]
    ]);
  });
});

test("getMerkleRoot", () => {
  expect(getMerkleRoot(tree)).toBe("a");
});

test("flattenTree", () => {
  /*
    Input tree (upside down):
                 a
                / \
               b   c
              / \ / \
             d  e f  g
  */
  expect(flattenTree(tree)).toStrictEqual(["g", "f", "e", "d", "c", "b", "a"]);
});
