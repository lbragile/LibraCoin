import { ITransaction } from "../typings/AppTypes";
import { digestMessage } from "./conversion";

export async function calculateMerkleTreeFormation(
  verifiedTrans: ITransaction[],
  selectedTrans: ITransaction[]
): Promise<string[][]> {
  let tree = [[""]];
  if (selectedTrans.length > 0) {
    // need to make sure node's in tree appear in same order as in the verified transaction pane, regardless of selection order
    const verifiedSignatures = verifiedTrans.map((trans) => trans.signature);
    const selectedSignatures = selectedTrans.map((trans) => trans.signature);
    let signatures = verifiedSignatures.filter((sig) => selectedSignatures.includes(sig));
    tree = [signatures];

    while (signatures.length !== 1) {
      const hashArr = [] as string[];
      for (let i = 0; i < signatures.length; i += 2) {
        const hash = signatures[i + 1] ? await digestMessage(signatures[i] + signatures[i + 1]) : signatures[i];
        hashArr.push(hash);
      }

      signatures = hashArr;
      tree.push(hashArr);
    }
  }

  return tree;
}

export function getMerkleRoot(tree: string[][]): string {
  return tree[tree.length - 1][0];
}

export function flattenTree(tree: string[][]): string[] {
  let flatTree = [] as string[];
  // need to reverse each tree row so that printing produces the right order!
  for (let i = 0; i < tree.length; i++) {
    flatTree = flatTree.concat(tree[i].reverse());
  }

  return flatTree;
}
