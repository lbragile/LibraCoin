import { createGlobalStyle } from "styled-components";
import { COLORS } from "../enums/ColorPallet";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: radial-gradient(${COLORS.PRIMARY_COLOR} 70%, ${COLORS.SECONDARY_COLOR} 100%);
    width: 100vw;
    height: 100vh;
  }

  .input-group-text {
    font-weight: bold;
  }
`;
