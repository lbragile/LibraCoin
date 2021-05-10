import React from "react";
import NavMenu from "../../src/components/NavMenu/NavMenu";

import { render } from "@testing-library/react";

interface IActiveStateProps {
  route: string;
  wallet: boolean;
  mine: boolean;
  blockchain: boolean;
}

it("renders correctly", () => {
  const { getByText, container } = render(<NavMenu />);

  const walletLink = getByText("Wallet");
  const mineLink = getByText("Mine");
  const blockChainLink = getByText("Blockchain");
  const brandLink = container.querySelector(".navbar-brand");
  const brandImg = brandLink.firstChild;

  // links & images render properly
  [walletLink, mineLink, blockChainLink, brandLink, brandImg].forEach((link) => {
    expect(link).toBeTruthy();
  });

  // links have correct href
  expect(walletLink.getAttribute("href")).toBe("/LibraCoin/wallet");
  expect(mineLink.getAttribute("href")).toBe("/LibraCoin/mine");
  expect(blockChainLink.getAttribute("href")).toBe("/LibraCoin/blockchain");
  expect(brandLink.getAttribute("href")).toBe("https://github.com/lbragile/LibraCoin");

  expect(container).toMatchSnapshot();
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
    location.href = baseURL + route;

    const { getByText } = render(<NavMenu />);
    const walletLink = getByText("Wallet");
    const mineLink = getByText("Mine");
    const blockChainLink = getByText("Blockchain");

    expect(Object.values(walletLink.classList).includes("active")).toEqual(wallet);
    expect(Object.values(mineLink.classList).includes("active")).toEqual(mine);
    expect(Object.values(blockChainLink.classList).includes("active")).toEqual(blockchain);
  });
});
