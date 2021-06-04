import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { IAction, IState } from "../../typings/AppTypes";
import { calculateMerkleTreeFormation, drawTreeDiagramOnCanvas, getMerkleRoot } from "../../utils/merkleTree";
interface IPreviewTreeProps {
  setMerkleRoot: (arg: string) => void;
}

export default function PreviewTree({ setMerkleRoot }: IPreviewTreeProps): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const treeCanvas = useRef<HTMLCanvasElement | null>(null);
  const [merkleTree, setMerkleTree] = useState<string[][]>([[""]]);

  useEffect(() => {
    setMerkleRoot(getMerkleRoot(merkleTree));
  }, [merkleTree, setMerkleRoot]);

  useEffect(() => {
    calculateMerkleTreeFormation(state.verifiedTrans, state.selectedTrans, setMerkleTree);
  }, [dispatch, state.selectedTrans, state.verifiedTrans, state.preview]);

  // draw tree in canvas
  useEffect(() => {
    drawTreeDiagramOnCanvas(merkleTree, treeCanvas.current, state.selectedTrans);
  }, [merkleTree, state.selectedTrans]);

  return (
    <div className="mb-2 d-none d-lg-block">
      <h4 className="font-weight-bold text-center">Merkle Tree Visualization</h4>
      <canvas ref={treeCanvas} className="border border-dark rounded" width={window.outerWidth * 0.7} />
    </div>
  );
}
