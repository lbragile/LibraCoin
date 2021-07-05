import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { StyledNav, StyledNavLink } from "../../styles/NavMenuStyles";

const NavLinkWrapper = ({ text }: { text: string }) => {
  return (
    <StyledNavLink href={"/LibraCoin/" + text} active={location.href.includes("/" + text)}>
      {text[0].toUpperCase() + text.slice(1)}
    </StyledNavLink>
  );
};

export default function NavMenu(): JSX.Element {
  return (
    <StyledNav expand="lg" className="mb-3">
      <Navbar.Brand aria-label="LibraCoin Logo" href="https://github.com/lbragile/LibraCoin">
        <img src="./assets/libracoin-logo-256.png" alt="LibraCoin Logo" width="64" height="64" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <NavLinkWrapper text="wallet" />
          <NavLinkWrapper text="mine" />
          <NavLinkWrapper text="blockchain" />
        </Nav>
      </Navbar.Collapse>
    </StyledNav>
  );
}
