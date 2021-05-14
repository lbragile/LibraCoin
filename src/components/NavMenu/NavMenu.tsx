import React from "react";
import { Navbar, Nav } from "react-bootstrap";

import "./NavMenu.css";

export default function NavMenu(): JSX.Element {
  return (
    <Navbar expand="lg" className="mb-3">
      <Navbar.Brand aria-label="LibraCoin Logo" href="https://github.com/lbragile/LibraCoin">
        <img src="./assets/libracoin-logo-256.png" alt="LibraCoin Logo" width="64" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/LibraCoin/wallet" active={location.href.includes("/wallet")}>
            Wallet
          </Nav.Link>
          <Nav.Link href="/LibraCoin/mine" active={location.href.includes("/mine")}>
            Mine
          </Nav.Link>
          <Nav.Link href="/LibraCoin/blockchain" active={location.href.includes("/blockchain")}>
            Blockchain
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
