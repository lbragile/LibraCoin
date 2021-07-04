import { useEffect, useState } from "react";
import { ITransaction } from "../typings/AppTypes";
import { calculateMerkleTreeFormation } from "../utils/merkleTree";

export function useDrawPreviewTree(verified: ITransaction[], selected: ITransaction[]): string[][] {
  const [tree, setTree] = useState<string[][]>([[""]]);

  useEffect(() => {
    async function drawTree() {
      const newTree = await calculateMerkleTreeFormation(verified, selected);
      setTree(newTree);
    }

    drawTree();
  }, [verified, selected]);

  return tree;
}
