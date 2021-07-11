import React, { useRef } from "react";
import { Table } from "react-bootstrap";
import { useAppContext } from "../../hooks/useAppContext";
import { useDrawPreviewTree } from "../../hooks/useDrawPreviewTree";
import { IStyledTableDataProps, StyledTableData } from "../../styles/BlockStyles";

export default function PreviewTree(): JSX.Element {
  const { state } = useAppContext();

  const numCells = useRef<number>(9);
  const strLen = useRef<number>(20);
  const tree = useDrawPreviewTree(state.verifiedTrans, state.selectedTrans);

  // https://stackoverflow.com/a/1199420/4298115
  function truncate(str: string, n = strLen.current): string {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  function getText(rowNum: number, index: number, isTitle: boolean): string {
    let text = "";

    switch (rowNum) {
      case 0: {
        if (index === Math.floor(numCells.current / 2)) {
          text = isTitle ? tree[tree.length - 1][0] : truncate(tree[tree.length - 1][0]);
        }
        break;
      }

      case 1: {
        if (index === numCells.current / 3 - 1) {
          text = isTitle ? tree[tree.length - 2][0] : truncate(tree[tree.length - 2][0]);
        } else if (index === (numCells.current / 3) * 2) {
          text = isTitle ? tree[tree.length - 2][1] : truncate(tree[tree.length - 2][1]);
        }
        break;
      }

      case 2: {
        if (index === 0) {
          text = isTitle ? tree[0][0] : truncate(tree[0][0]);
        } else if (index === numCells.current / 3 - 1) {
          text = isTitle ? tree[0][1] : truncate(tree[0][1]);
        } else if (index === (numCells.current / 3) * 2) {
          text = isTitle ? tree[0][2] : truncate(tree[0][2]);
        } else if (index === numCells.current - 1) {
          text = isTitle ? tree[0][3] : truncate(tree[0][3]);
        }
        break;
      }

      // no default
    }

    return text;
  }

  function getClassName(rowNum: number, index: number): IStyledTableDataProps {
    let type = {
      rootCell: false,
      middleCells: false,
      dataCells: false,
      diagRightLine: false,
      diagLeftLine: false,
      normalLine: false
    };

    switch (rowNum) {
      case 0:
        type = { ...type, rootCell: index === Math.floor(numCells.current / 2) };
        break;

      case 1: {
        type = { ...type, diagLeftLine: index === numCells.current / 3 };
        type = { ...type, diagRightLine: index === (2 * numCells.current) / 3 - 1 };
        break;
      }

      case 2: {
        const isCorrectColumn = [numCells.current / 3 - 1, (2 * numCells.current) / 3].includes(index);
        type = { ...type, dataCells: isCorrectColumn && tree.length <= 2 };
        type = { ...type, middleCells: isCorrectColumn && tree.length > 2 };
        break;
      }

      case 3: {
        type = { ...type, diagLeftLine: index === 1 };
        type = { ...type, diagRightLine: index === numCells.current - 2 && tree[0].length === 4 };
        type = { ...type, normalLine: [numCells.current / 3 - 1, (numCells.current / 3) * 2].includes(index) };
        break;
      }

      case 4: {
        const isCorrectColumn = [0, numCells.current / 3 - 1, (numCells.current / 3) * 2].includes(index);
        type = { ...type, dataCells: isCorrectColumn || (numCells.current - 1 === index && tree[0].length === 4) };
        break;
      }

      // no default
    }

    return type;
  }

  return (
    <div className="w-100 mb-2 text-center">
      <h3 className="font-weight-bold w-25 mx-auto">Merkle Tree Visualization</h3>
      {tree[tree.length - 1][0] !== "" ? (
        <Table
          role="grid"
          aria-label="Preview Table"
          className="w-75 mx-auto my-1 text-center border"
          responsive
          size="sm"
        >
          <tbody role="presentation">
            <tr>
              {Array.from({ length: numCells.current }).map((_, i) => (
                <StyledTableData key={"first-data-row-" + i} type={getClassName(0, i)} title={getText(0, i, true)}>
                  {getText(0, i, false)}
                </StyledTableData>
              ))}
            </tr>
            {tree.length >= 2 && (
              <>
                <tr>
                  {Array.from({ length: numCells.current }).map((_, i) => (
                    <StyledTableData key={"first-break-row-" + i} type={getClassName(1, i)} />
                  ))}
                </tr>
                <tr>
                  {Array.from({ length: numCells.current }).map((_, i) => (
                    <StyledTableData key={"second-data-row-" + i} type={getClassName(2, i)} title={getText(1, i, true)}>
                      {getText(1, i, false)}
                    </StyledTableData>
                  ))}
                </tr>
              </>
            )}
            {tree.length === 3 && (
              <>
                <tr>
                  {Array.from({ length: numCells.current }).map((_, i) => (
                    <StyledTableData key={"second-break-row-" + i} type={getClassName(3, i)} />
                  ))}
                </tr>
                <tr>
                  {Array.from({ length: numCells.current }).map((_, i) => (
                    <StyledTableData key={"third-data-row-" + i} type={getClassName(4, i)} title={getText(2, i, true)}>
                      {getText(2, i, false)}
                    </StyledTableData>
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
