import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import { IState } from "../../typings/AppTypes";
import { calculateMerkleTreeFormation, drawTreeDiagramOnCanvas } from "../../utils/merkleTree";
import { Tree } from "../../utils/Tree";

export default function PreviewTree(): JSX.Element {
  const { state } = useContext(AppContext) as { state: IState };

  const treeCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function drawTree() {
      if (treeCanvas.current) {
        const tree = await calculateMerkleTreeFormation(state.verifiedTrans, state.selectedTrans);
        const canvasTree = new Tree(treeCanvas.current, state.selectedTrans);
        drawTreeDiagramOnCanvas(tree, canvasTree);
      }
    }

    drawTree();
  }, [state.selectedTrans, state.verifiedTrans]);

  return (
    <div className="mb-2 d-none d-lg-block">
      <h4 className="font-weight-bold text-center">Merkle Tree Visualization</h4>
      <canvas ref={treeCanvas} className="border border-dark rounded" width={window.outerWidth * 0.7} />
    </div>
  );
}
