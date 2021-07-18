import { Nav, Navbar } from "react-bootstrap";
import styled from "styled-components";

import { COLORS } from "../enums/ColorPallet";

export const StyledNav = styled(Navbar)`
  background-color: transparent;
`;

export const StyledNavLink = styled(Nav.Link)`
  &&& {
    font-size: larger;
    font-weight: bolder;
    text-align: right;
  }

  &&&:hover,
  &&&.active {
    font-weight: bolder;
  }

  &&&:hover {
    text-decoration: underline;
    text-decoration-color: ${COLORS.NAV_LINK_UNDERSCORE};
    text-underline-offset: 8px;
  }
`;
