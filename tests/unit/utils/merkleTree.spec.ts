import {
  calculateMerkleTreeFormation,
  drawTreeDiagramOnCanvas,
  flattenTree,
  getMerkleRoot
} from "../../../src/utils/merkleTree";
import { Tree } from "../../../src/utils/Tree";
import * as ConversionUtil from "../../../src/utils/conversion";

jest.mock("../../../src/utils/Tree");

const { initialState } = global;
const canvas = document.createElement("canvas");
let tree: string[][];
beforeEach(() => (tree = [["d", "e", "f", "g"], ["b", "c"], ["a"]]));

describe("calculateMerkleTreeFormation", () => {
  test("no selected transactions", async () => {
    expect(await calculateMerkleTreeFormation(initialState.verifiedTrans, [])).toStrictEqual([[""]]);
  });

  test("1 selected transactions", async () => {
    const { verifiedTrans, selectedTrans } = initialState;
    const expectedValue = [[selectedTrans[0].signature]];
    expect(await calculateMerkleTreeFormation(verifiedTrans, selectedTrans)).toStrictEqual(expectedValue);
  });

  test("multiple selected transactions", async () => {
    jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce("ABCDE");
    const { verifiedTrans, selectedTrans } = initialState;
    const expectedValue = [[verifiedTrans[0].signature, selectedTrans[0].signature], ["ABCDE"]];

    const extraSelTrans = [...selectedTrans, verifiedTrans[0]];
    expect(await calculateMerkleTreeFormation(verifiedTrans, extraSelTrans)).toStrictEqual(expectedValue);
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

test("drawTreeDiagramOnCanvas", () => {
  const canvasTree = new Tree(canvas, initialState.selectedTrans);
  const flatTree = ["g", "f", "e", "d", "c", "b", "a"].reverse();

  drawTreeDiagramOnCanvas(tree, canvasTree);

  expect(canvasTree.clear).toHaveBeenCalledTimes(1);
  expect(canvasTree.addNode).toHaveBeenCalledTimes(flatTree.length);
  flatTree.forEach((val, i) => expect(canvasTree.addNode).toHaveBeenNthCalledWith(i + 1, val));
  expect(canvasTree.drawTree).toHaveBeenCalledTimes(1);
});
