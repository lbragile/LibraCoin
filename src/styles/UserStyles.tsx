import { Form, InputGroup } from "react-bootstrap";
import styled from "styled-components";

import { COLORS } from "../enums/ColorPallet";

export const UserKey = styled(InputGroup)`
  margin: 0.25em 0.5em;
  word-wrap: break-word;
`;

export const UserItem = styled(Form)`
  background-color: ${COLORS.DEFAULT_BACKGROUND};
  margin: 1em 0.5em;
  padding: 1em;
  width: 14rem;
`;

export const RevealEyes = styled.span`
  &:hover {
    cursor: pointer;
  }
`;
