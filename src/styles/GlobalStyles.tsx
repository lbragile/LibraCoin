import { InputGroup } from "react-bootstrap";
import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

export const StyledInputGroupText = styled(InputGroup.Text)`
  &&& {
    font-weight: bold;
  }
`;
