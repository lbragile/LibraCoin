import { Button, Form, InputGroup } from "react-bootstrap";
import styled from "styled-components";

import { COLORS } from "../enums/ColorPallet";

export interface IStyledTableDataProps {
  rootCell: boolean;
  middleCells: boolean;
  dataCells: boolean;
  diagRightLine: boolean;
  diagLeftLine: boolean;
  normalLine: boolean;
}

const GradientLine = (dir: string) => {
  return `linear-gradient(${dir}, transparent calc(50% - 1px), ${COLORS.PREVIEW_LINES}, transparent calc(50% + 1px));`;
};

export const StyledTableData = styled.td`
  width: 11%;
  height: 35px;
  color: white;

  /* increase the specificity to avoid using !important */
  &&& {
    border-top: none;
  }

  /* stylelint-disable */
  background: ${({ type }: { type: IStyledTableDataProps }) =>
    type.rootCell
      ? COLORS.ROOT_CELL
      : type.middleCells
      ? COLORS.MIDDLE_CELLS
      : type.dataCells
      ? COLORS.DATA_CELLS
      : type.diagRightLine
      ? GradientLine("to top right")
      : type.diagLeftLine
      ? GradientLine("to top left")
      : type.normalLine
      ? GradientLine("to left")
      : "transparent"};
  /* stylelint-enable */
`;

export const StyledInput = styled(Form.Control)`
  color: ${(props) => (props.theme.valid ? COLORS.VALID_SOLUTION : COLORS.INVALID_SOLUTION)};
`;

export const StyledBlockForm = styled(Form)`
  background-color: ${(props) => (props.theme.valid ? COLORS.VALID_BACKGROUND : COLORS.INVALID_BACKGROUND)};
`;

export const RevealBlockTransText = styled(InputGroup.Text)`
  &:hover {
    cursor: pointer;
  }
`;

export const BlockContainer = styled.div`
  width: 20rem;
  height: fit-content;
  padding: 8px;
  border-radius: 4px;
`;

export const StyledButton = styled(Button)`
  padding: 4px 0;
  margin-top: 8px;
  font-size: 2rem;
  display: flex;
  justify-content: center;
`;

export const StyledStatisticsForm = styled(Form)`
  height: fit-content;
`;
