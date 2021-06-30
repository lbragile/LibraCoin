/**
 * @group integration
 */

import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Chain from "../../src/pages/Chain";
import * as ConversionUtil from "../../src/utils/conversion";
import { customRender } from "../utils/testUtils";

const { initialState } = global;

// add an extra block to the chain to validate propagation
const ogChain = [...initialState.chain];
ogChain.push({
  index: 3,
  prevHash: new Array(64).fill("Z").join(""),
  currHash: new Array(64).fill("Y").join(""),
  transactions: [
    {
      to: "Z",
      from: "Y",
      amount: 123.45,
      msg: "Fifth Transaction",
      signature: "ZY123.45"
    }
  ],
  timestamp: Date.parse("01 May 2021 00:00:00 UTC"),
  merkleRoot: "123.45ZFifthTransactionY123.45Z",
  valid: false,
  showTrans: true
});

const newState = { ...initialState, chain: ogChain };

it.each`
  type
  ${"valid"}
  ${"invalid"}
`("starts off invalid, after mining it stays $type, propagates to future blocks", async ({ type }) => {
  const solution =
    "000" + (type === "valid" ? "x" : "z") + "4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
  const target = "000y4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
  const index = 2;
  Date.now = jest.fn().mockReturnValueOnce(12345);
  jest.spyOn(ConversionUtil, "randomHash").mockReturnValue("random");
  jest
    .spyOn(ConversionUtil, "digestMessage")
    .mockResolvedValue("currHash")
    .mockResolvedValueOnce(target)
    .mockResolvedValueOnce(solution);

  const { asFragment } = customRender(<Chain />, { stateMock: newState });

  expect(screen.getAllByRole("form", { name: /Block Statistics/i })[index]).toHaveFormValues({
    nonce: 0,
    header: 0,
    target: "",
    solution: ""
  });

  expect(screen.getAllByRole("form", { name: /Block Form/i })[index]).toHaveFormValues({
    ...initialState.chain[index],
    valid: undefined,
    transactions: undefined,
    showTrans: undefined
  });

  expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();
  expect(screen.getAllByRole("form", { name: /Block Form/i })[index]).toHaveClass("invalid-block");
  expect(screen.getAllByRole("textbox", { name: /Block Solution/i })[index]).toHaveClass("invalid-solution");

  expect(asFragment()).toMatchSnapshot();

  userEvent.click(screen.getAllByRole("button", { name: /Block Mine/i })[index]);

  // once mining is complete
  await waitFor(() => expect(screen.getAllByRole("status")[index]).toHaveClass("invisible"));

  const blocks = screen.getAllByRole("form", { name: /Block Form/i });

  // mined block assertions
  expect(blocks[index]).toHaveFormValues({
    index: index,
    timestamp: 12345,
    prevHash: initialState.chain[index - 1].currHash,
    currHash: solution
  });

  expect(blocks[index]).toHaveClass(type + "-block");

  // next block assertions
  expect(blocks[index + 1]).toHaveFormValues({
    index: index + 1,
    timestamp: 12345,
    prevHash: solution,
    currHash: "currHash"
  });

  expect(blocks[index + 1]).toHaveClass("invalid-block");

  // mine button assertions
  const mineButtons = screen.getAllByRole("button", { name: /Block Mine/i });

  // buttons before can be enabled if blocks are invalid
  // eslint-disable-next-line jest/no-conditional-expect
  type === "valid" ? expect(mineButtons[index]).toBeDisabled() : expect(mineButtons[index]).toBeEnabled();

  // all buttons after mined block
  for (let i = index + 1; i < mineButtons.length; i++) {
    expect(mineButtons[i]).toBeEnabled();
  }
});

it.each`
  type
  ${"valid"}
  ${"invalid"}
`("starts off invalid, after mining it stays $type, does not propagate since last", async ({ type }) => {
  const solution =
    "000" + (type === "valid" ? "x" : "z") + "4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
  const target = "000y4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
  const index = 3;
  Date.now = jest.fn().mockReturnValueOnce(12345);
  jest.spyOn(ConversionUtil, "randomHash").mockReturnValue("random");
  jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce(target).mockResolvedValueOnce(solution);

  const { asFragment } = customRender(<Chain />, { stateMock: newState });

  expect(screen.getAllByRole("form", { name: /Block Statistics/i })[index]).toHaveFormValues({
    nonce: 0,
    header: 0,
    target: "",
    solution: ""
  });

  expect(screen.getAllByRole("form", { name: /Block Form/i })[index]).toHaveFormValues({
    ...initialState.chain[index],
    valid: undefined,
    transactions: undefined,
    showTrans: undefined
  });

  expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();
  expect(screen.getAllByRole("form", { name: /Block Form/i })[index]).toHaveClass("invalid-block");
  expect(screen.getAllByRole("textbox", { name: /Block Solution/i })[index]).toHaveClass("invalid-solution");

  expect(asFragment()).toMatchSnapshot();

  userEvent.click(screen.getAllByRole("button", { name: /Block Mine/i })[index]);

  // once mining is complete
  await waitFor(() => expect(screen.getAllByRole("status")[index]).toHaveClass("invisible"));

  const blocks = screen.getAllByRole("form", { name: /Block Form/i });

  // mined block assertions
  expect(blocks[index]).toHaveFormValues({
    index: index,
    timestamp: 12345,
    prevHash: initialState.chain[index - 1].currHash,
    currHash: solution
  });

  expect(blocks[index]).toHaveClass(type + "-block");

  expect(blocks[index + 1]).toBeUndefined();

  // mine button assertions
  const mineButtons = screen.getAllByRole("button", { name: /Block Mine/i });

  // buttons before can be enabled if blocks are invalid
  // eslint-disable-next-line jest/no-conditional-expect
  type === "valid" ? expect(mineButtons[index]).toBeDisabled() : expect(mineButtons[index]).toBeEnabled();

  expect(mineButtons[index + 1]).toBeUndefined();
});

describe("block transactions", () => {
  it("shows transactions when reveal icon is clicked", () => {
    const { asFragment } = customRender(<Chain />, { stateMock: newState });

    const visibleGroups = newState.chain.filter((block) => block.showTrans);

    const numTransVisible = visibleGroups
      .map((block) => block.transactions.length)
      .reduce((total, curr) => total + curr, 0);

    expect(screen.getAllByRole("list", { name: /Block Transactions Group/i })).toHaveLength(visibleGroups.length);
    expect(screen.getAllByRole("listitem", { name: /Block Transactions Item/i })).toHaveLength(numTransVisible);

    userEvent.click(screen.getAllByText("🙉")[0]); // genesis block does not have the reveal icon

    expect(screen.getAllByRole("list", { name: /Block Transactions Group/i })).toHaveLength(visibleGroups.length + 1);
    expect(screen.getAllByRole("listitem", { name: /Block Transactions Item/i })).toHaveLength(numTransVisible + 1);

    expect(asFragment()).toMatchSnapshot();
  });

  it("hides transactions when reveal icon is clicked", () => {
    const { asFragment } = customRender(<Chain />, { stateMock: newState });

    const visibleGroups = newState.chain.filter((block) => block.showTrans);

    const numTransVisible = visibleGroups
      .map((block) => block.transactions.length)
      .reduce((total, curr) => total + curr, 0);

    expect(screen.getAllByRole("list", { name: /Block Transactions Group/i })).toHaveLength(visibleGroups.length);
    expect(screen.getAllByRole("listitem", { name: /Block Transactions Item/i })).toHaveLength(numTransVisible);

    userEvent.click(screen.getAllByText("🙈")[0]); // genesis block does not have the reveal icon

    expect(screen.getAllByRole("list", { name: /Block Transactions Group/i })).toHaveLength(visibleGroups.length - 1);
    expect(screen.getAllByRole("listitem", { name: /Block Transactions Item/i })).toHaveLength(numTransVisible - 1);

    expect(asFragment()).toMatchSnapshot();
  });
});

// TODO - this needs to be tested better, currently just a starting point
describe("change of transaction details causes a change in merkle root and propagation", () => {
  beforeAll(() => (Date.now = jest.fn().mockReturnValue(12345)));
  beforeEach(() => jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValue("some message"));

  test.each`
    field
    ${"From"}
    ${"To"}
    ${"Amount"}
    ${"Message"}
  `("change in $field input", async ({ field }) => {
    const { asFragment } = customRender(<Chain />, { stateMock: newState });
    const originalSignature = screen.getAllByRole("textbox", { name: /Block Transactions Signature/i })[0].textContent; // genesis has no transactions
    const originalMerkle = screen.getAllByRole("textbox", { name: /Block Merkle/i })[2].textContent;

    userEvent.type(
      screen.getAllByRole(field === "Amount" ? "spinbutton" : "textbox", {
        name: new RegExp(`Block Transactions ${field}`, "i")
      })[0],
      field === "Amount" ? "123.02" : "new " + field
    );

    // check that signature changes
    await waitFor(() =>
      expect(screen.getAllByRole("textbox", { name: /Block Transactions Signature/i })[0]).not.toHaveValue(
        originalSignature
      )
    );

    // check that merkle root for block changed
    expect(screen.getAllByRole("textbox", { name: /Block Merkle/i })[2]).not.toHaveValue(originalMerkle);
    expect(screen.getAllByRole("form", { name: /Block Form/i })[2]).toHaveClass("invalid-block");

    expect(asFragment()).toMatchSnapshot();
  });
});
