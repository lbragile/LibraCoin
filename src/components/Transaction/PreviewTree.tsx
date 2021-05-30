import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { IState } from "../../typings/AppTypes";
import { calculateMerkleTreeFormation, drawTreeDiagramOnCanvas, getMerkleRoot } from "../../utils/merkleTree";
interface IPreviewTreeProps {
  setMerkleRoot: (arg: string) => void;
  setIsValid: (arg: boolean[]) => void;
}

export default function PreviewTree({ setMerkleRoot, setIsValid }: IPreviewTreeProps): JSX.Element {
  const { state } = useContext(AppContext) as { state: IState };

  const treeCanvas = useRef<HTMLCanvasElement | null>(null);
  const [merkleTree, setMerkleTree] = useState<string[][]>([[""]]);

  useEffect(() => {
    setMerkleRoot(getMerkleRoot(merkleTree));
  }, [merkleTree, setMerkleRoot]);

  useEffect(() => {
    calculateMerkleTreeFormation(state.verifiedTrans, state.selectedTrans, setMerkleTree);
    setIsValid([false]);
  }, [state.selectedTrans, state.verifiedTrans, setIsValid]);

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
