import React from "react";
import { Navbar, Nav } from "react-bootstrap";

import "./Navbar.css";

export default function NavbarUI(): JSX.Element {
  return (
    <Navbar bg="none" expand="lg" className="mb-3">
      <Navbar.Brand href="#home">
        <img src="assets/libracoin-logo-256.png" width="64" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/wallet" active={location.href.includes("/wallet")}>
            Wallet
          </Nav.Link>
          <Nav.Link href="/mine" active={location.href.includes("/mine")}>
            Mine
          </Nav.Link>
          <Nav.Link href="/blockchain" active={location.href.includes("/blockchain")}>
            Blockchain
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
