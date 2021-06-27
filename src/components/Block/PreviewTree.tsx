import React, { useContext, useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { IState } from "../../typings/AppTypes";
import { calculateMerkleTreeFormation } from "../../utils/merkleTree";

import "./Block.scss";

export default function PreviewTree(): JSX.Element {
  const { state } = useContext(AppContext) as { state: IState };

  const numCells = useRef<number>(9);
  const strLen = useRef<number>(20);
  const [tree, setTree] = useState<string[][]>([[""]]);

  useEffect(() => {
    async function drawTree() {
      const newTree = await calculateMerkleTreeFormation(state.verifiedTrans, state.selectedTrans);
      setTree(newTree);
    }

    drawTree();
  }, [state.selectedTrans, state.verifiedTrans]);

  // https://stackoverflow.com/a/1199420/4298115
  function truncate(str: string, n = strLen.current): string {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <div className="w-100 my-3 text-center">
      <h3 className="font-weight-bold">Merkle Tree Visualization</h3>
      {tree[tree.length - 1][0] !== "" ? (
        <Table className="w-75 mx-auto my-3 text-center border" responsive size="sm">
          <tbody>
            <tr>
              {Array.from({ length: numCells.current }).map((_, i) => (
                <td key={"first-row-" + i} className={i === Math.floor(numCells.current / 2) ? "root-cell" : ""}>
                  {i === Math.floor(numCells.current / 2) ? truncate(tree[tree.length - 1][0]) : ""}
                </td>
              ))}
            </tr>
            {tree.length >= 2 && (
              <>
                <tr>
                  {Array.from({ length: numCells.current }).map((_, i) => (
                    <td
                      key={"second-row-" + i}
                      className={
                        i === numCells.current / 3
                          ? "diag-line-left"
                          : i === (2 * numCells.current) / 3 - 1
                          ? "diag-line-right"
                          : ""
                      }
                    />
                  ))}
                </tr>
                <tr>
                  {Array.from({ length: numCells.current }).map((_, i) => (
                    <td
                      key={"third-row-" + i}
                      className={
                        [numCells.current / 3 - 1, (2 * numCells.current) / 3].includes(i) && tree.length === 2
                          ? " data-cells"
                          : [numCells.current / 3 - 1, (2 * numCells.current) / 3].includes(i) && tree.length > 2
                          ? " middle-cells"
                          : ""
                      }
                    >
                      {i === numCells.current / 3 - 1
                        ? truncate(tree[tree.length - 2][0])
                        : i === (numCells.current / 3) * 2
                        ? truncate(tree[tree.length - 2][1])
                        : ""}
                    </td>
                  ))}
                </tr>
              </>
            )}
            {tree.length === 3 && (
              <>
                <tr>
                  {Array.from({ length: numCells.current }).map((_, i) => (
                    <td
                      key={"forth-row-" + i}
                      className={
                        i === 1
                          ? "diag-line-left"
                          : i === numCells.current - 2 && tree[0].length === 4
                          ? "diag-line-right"
                          : [numCells.current / 3 - 1, (numCells.current / 3) * 2].includes(i)
                          ? "normal-line"
                          : ""
                      }
                    />
                  ))}
                </tr>
                <tr>
                  {Array.from({ length: numCells.current }).map((_, i) => (
                    <td
                      key={"third-row-" + i}
                      className={
                        [0, numCells.current / 3 - 1, (numCells.current / 3) * 2].includes(i) ||
                        (numCells.current - 1 === i && tree[0].length === 4)
                          ? "data-cells"
                          : ""
                      }
                    >
                      {i === 0
                        ? truncate(tree[0][0])
                        : i === numCells.current / 3 - 1
                        ? truncate(tree[0][1])
                        : i === (numCells.current / 3) * 2
                        ? truncate(tree[0][2])
                        : i === numCells.current - 1
                        ? truncate(tree[0][3])
                        : ""}
                    </td>
                  ))}
                </tr>
              </>
            )}
          </tbody>
        </Table>
      ) : (
        <p className="my-3 border w-75 mx-auto">Please select a verified transaction from above...</p>
      )}
    </div>
  );
}
