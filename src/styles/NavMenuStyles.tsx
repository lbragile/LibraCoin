import { Nav, Navbar } from "react-bootstrap";
import styled from "styled-components";

import { COLORS } from "../enums/ColorPallet";
import { DEVICES } from "../enums/Breakpoints";

export const StyledNav = styled(Navbar)`
  background-color: ${COLORS.NAVBAR_BACKGROUND};
`;

export const StyledNavLink = styled(Nav.Link)`
  font-size: larger;
  text-align: right;
  color: ${COLORS.NAV_TEXT};
  font-weight: bolder;

  &:hover,
  &.active {
    font-weight: bolder;
  }

  &:hover {
    border-bottom: ${COLORS.NAV_LINK_UNDERSCORE} 1px solid;
  }

  @media only screen and (${DEVICES.xs}) {
    &:hover {
      border-bottom: none;
    }
  }
`;
