import { Form } from "react-bootstrap";
import styled, { css } from "styled-components";

import { COLORS } from "../enums/ColorPallet";

// create a "mixin"
const Transaction = (margin: string, padding: string, borderRadius: string, border: string) => css`
  margin: ${margin};
  padding: ${padding};
  border-radius: ${borderRadius};
  border: ${border};
`;

export const TransList = styled.div`
  min-height: 18rem;
`;

export const TransItem = styled(Form)`
  ${Transaction("0.5rem", "0.5em", "5px", "2px solid transparent")}; /* stylelint-disable-line */
  min-width: 14rem;
  background-color: ${(props) => (props.theme.selected ? COLORS.SELECTED_TRANS_BACKGROUND : COLORS.DEFAULT_BACKGROUND)};

  &:hover {
    cursor: pointer;
    border: 2px solid ${COLORS.SELECTED_TRANS_BORDER};
  }
`;

export const TransForm = styled(Form)`
  ${Transaction("0 1rem", "1em", "6px", "1px solid black")}; /* stylelint-disable-line */
  background-color: ${COLORS.DARK_BACKGROUND};
`;
