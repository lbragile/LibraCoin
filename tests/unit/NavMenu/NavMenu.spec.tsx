import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import NavMenu from "../../../src/components/NavMenu/NavMenu";

interface IActiveStateProps {
  route: string;
  wallet: boolean;
  mine: boolean;
  blockchain: boolean;
}

it("renders correctly", () => {
  const { asFragment } = render(<NavMenu />);

  const walletLink = screen.getByText("Wallet");
  const mineLink = screen.getByText("Mine");
  const blockChainLink = screen.getByText("Blockchain");
  const brandLink = screen.getByRole("link", { name: /LibraCoin Logo/i }) as HTMLAnchorElement;
  const brandImg = screen.getByAltText(/LibraCoin Logo/i);

  // links & images render properly
  [walletLink, mineLink, blockChainLink, brandLink, brandImg].forEach((link) => {
    expect(link).toBeInTheDocument();
  });

  // links have correct href
  expect(walletLink).toHaveAttribute("href", "/LibraCoin/wallet");
  expect(mineLink).toHaveAttribute("href", "/LibraCoin/mine");
  expect(blockChainLink).toHaveAttribute("href", "/LibraCoin/blockchain");
  expect(brandLink).toHaveAttribute("href", "https://github.com/lbragile/LibraCoin");

  expect(asFragment()).toMatchSnapshot();
});

describe("Check active state of nav links for different URLs", () => {
  let baseURL: string;

  beforeAll(() => {
    baseURL = location.href;
    // make location.href be able to change
    Object.defineProperty(window, "location", { value: { href: baseURL }, writable: true });
  });

  afterAll(() => {
    Object.defineProperty(window, "location", { value: { href: baseURL } });
  });

  it.each`
    route           | wallet   | mine     | blockchain
    ${"wallet"}     | ${true}  | ${false} | ${false}
    ${"mine"}       | ${false} | ${true}  | ${false}
    ${"blockchain"} | ${false} | ${false} | ${true}
  `("sets $route link to active, all other's inactive", ({ route, wallet, mine, blockchain }: IActiveStateProps) => {
    const base_class = "nav-link ";
    location.href = baseURL + route;

    render(<NavMenu />);

    expect(screen.getByText("Wallet")).toHaveClass(base_class + (wallet ? "active" : ""));
    expect(screen.getByText("Mine")).toHaveClass(base_class + (mine ? "active" : ""));
    expect(screen.getByText("Blockchain")).toHaveClass(base_class + (blockchain ? "active" : ""));
  });
});
