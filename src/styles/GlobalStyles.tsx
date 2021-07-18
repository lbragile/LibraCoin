import { createGlobalStyle } from "styled-components";
import { COLORS } from "../enums/ColorPallet";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 100vw;
    height: 100vh;
    background-color: ${COLORS.PRIMARY_COLOR};
  }

  .input-group-text {
    font-weight: bold;
  }

  .bg-secondary {
    background-color: ${COLORS.SECONDARY_COLOR} !important;
  }
`;
