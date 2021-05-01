import { Tree } from "../components/Block/tree";
import { ITransaction } from "../typings/AppTypes";
import { digestMessage } from "./conversion";

export async function calculateMerkleTreeFormation(
  selectedTrans: ITransaction[],
  setMerkleTree: (arg: string[][]) => void
): Promise<void> {
  if (selectedTrans.length > 0) {
    let signatures = selectedTrans.map((trans) => trans.signature);
    const tree = [signatures];

    while (signatures.length !== 1) {
      const hashArr = [] as string[];
      for (let i = 0; i < signatures.length; i += 2) {
        const hash = signatures[i + 1] ? await digestMessage(signatures[i] + signatures[i + 1]) : signatures[i];
        hashArr.push(hash);
      }

      tree.push(hashArr);
      signatures = hashArr;
    }

    setMerkleTree(tree);
  } else {
    setMerkleTree([[""]]);
  }
}

export function getMerkleRoot(tree: string[][]): string {
  return tree[tree.length - 1][0];
}

export function flattenTree(tree: string[][]): string[] {
  let flatTree = [] as string[];
  for (let i = 0; i < tree.length; i++) {
    flatTree = flatTree.concat(tree[i]);
  }

  return flatTree.reverse();
}

export function drawTreeDiagramOnCanvas(merkleTree: string[][], canvas: HTMLCanvasElement | null): void {
  if (canvas) {
    const canvasTree = new Tree(canvas);
    canvasTree.clear();
    const flatTree = flattenTree(merkleTree);
    flatTree.forEach((merkleHash) => canvasTree.addNode(merkleHash));
    canvasTree.drawTree();
  }
}
