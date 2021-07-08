import { Nav, Navbar } from "react-bootstrap";
import styled from "styled-components";

import { COLORS } from "../enums/ColorPallet";
import { DEVICES } from "../enums/Breakpoints";

export const StyledNav = styled(Navbar)`
  background-color: ${COLORS.NAVBAR_BACKGROUND};
`;

export const StyledNavLink = styled(Nav.Link)`
  font-size: larger;
  color: ${COLORS.NAV_TEXT};
  font-weight: bolder;
  text-align: right;

  &:hover,
  &.active {
    font-weight: bolder;
  }

  &:hover {
    text-decoration: underline;
    text-decoration-color: ${COLORS.NAV_LINK_UNDERSCORE};
    text-underline-offset: 8px;
  }

  @media only screen and (${DEVICES.xs}) {
    &:hover {
      text-decoration: none;
    }
  }
`;
