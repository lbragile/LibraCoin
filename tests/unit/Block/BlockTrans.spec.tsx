/**
 * @group unit
 */

import React from "react";
import { screen, waitFor } from "@testing-library/react";

import * as ConversionUtil from "../../../src/utils/conversion";

import BlockTrans from "../../../src/components/Block/BlockTrans";
import { customRender } from "../../utils/testUtils";
import userEvent from "@testing-library/user-event";
import { ACTIONS } from "../../../src/enums/AppDispatchActions";

const { initialState } = global;

it("renders correctly", async () => {
  const { asFragment } = customRender(<BlockTrans index={2} />);

  const form = await screen.findByRole("listitem", { name: /Block Transactions Item/i });
  expect(form).toBeVisible();
  expect(form).toHaveFormValues({
    btFrom: "Z",
    btTo: "A",
    btMsg: "Forth Transaction",
    btAmount: 567.89,
    btSignature: "AZ567.89"
  });

  expect(asFragment()).toMatchSnapshot();
});

describe("middle block", () => {
  const dispatchMock = jest.fn();

  // make only second block show the transactions
  const newInitialState = JSON.parse(JSON.stringify(initialState));
  newInitialState.chain[1].showTrans = true;
  newInitialState.chain[2].showTrans = false;

  beforeEach(() => {
    jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValue("some message");
    Date.now = jest.fn().mockReturnValue(12345);
    dispatchMock.mockClear();
  });

  test.each`
    field        | transaction
    ${"From"}    | ${{ amount: 987.65, from: "E1", msg: "Forth Transaction", signature: "some message", to: "A" }}
    ${"To"}      | ${{ amount: 987.65, from: "E", msg: "Forth Transaction", signature: "some message", to: "A1" }}
    ${"Amount"}  | ${{ amount: "987.651", from: "E", msg: "Forth Transaction", signature: "some message", to: "A" }}
    ${"Message"} | ${{ amount: 987.65, from: "E", msg: "Forth Transaction1", signature: "some message", to: "A" }}
  `("change of $field input causes propagation", async ({ field, transaction }) => {
    const { asFragment } = customRender(<BlockTrans index={1} />, { dispatchMock, stateMock: newInitialState });

    expect(await screen.findByRole("listitem", { name: /Block Transactions Item/i })).toBeInTheDocument();

    const name = new RegExp(`Block Transactions ${field}`, "i");
    userEvent.type(screen.getByRole(field === "Amount" ? "spinbutton" : "textbox", { name }), "1");

    // check that signature changes
    await waitFor(() => expect(dispatchMock).toHaveBeenCalledTimes(1));

    expect(dispatchMock).toHaveBeenCalledWith({
      type: ACTIONS.UPDATE_BLOCK,
      payload: {
        block: [
          {
            index: 1,
            timestamp: 12345,
            prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
            currHash: "some message",
            transactions: [transaction],
            merkleRoot: "some message",
            showTrans: true,
            valid: false
          },
          {
            index: 2,
            timestamp: 12345,
            prevHash: "some message",
            currHash: "some message",
            transactions: [{ amount: 567.89, from: "Z", msg: "Forth Transaction", signature: "AZ567.89", to: "A" }],
            merkleRoot: "567.89ZForthTransactionAZ567.89A",
            showTrans: false,
            valid: false
          }
        ]
      }
    });

    expect(screen.getByRole("textbox", { name: /Block Transactions Signature/i })).toHaveValue("some message");

    expect(asFragment()).toMatchSnapshot();
  });
});

describe("last block", () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValue("some message");
    Date.now = jest.fn().mockReturnValue(12345);
    dispatchMock.mockClear();
  });

  test.each`
    field        | transaction
    ${"From"}    | ${{ amount: 567.89, from: "Z1", msg: "Forth Transaction", signature: "some message", to: "A" }}
    ${"To"}      | ${{ amount: 567.89, from: "Z", msg: "Forth Transaction", signature: "some message", to: "A1" }}
    ${"Amount"}  | ${{ amount: "567.891", from: "Z", msg: "Forth Transaction", signature: "some message", to: "A" }}
    ${"Message"} | ${{ amount: 567.89, from: "Z", msg: "Forth Transaction1", signature: "some message", to: "A" }}
  `("change of $field input attempts propagation", async ({ field, transaction }) => {
    const { asFragment } = customRender(<BlockTrans index={2} />, { dispatchMock });

    expect(await screen.findByRole("listitem", { name: /Block Transactions Item/i })).toBeInTheDocument();

    const name = new RegExp(`Block Transactions ${field}`, "i");
    userEvent.type(screen.getByRole(field === "Amount" ? "spinbutton" : "textbox", { name }), "1");

    // check that signature changes
    await waitFor(() => expect(dispatchMock).toHaveBeenCalledTimes(1));

    expect(dispatchMock).toHaveBeenCalledWith({
      type: ACTIONS.UPDATE_BLOCK,
      payload: {
        block: [
          {
            index: 2,
            timestamp: 12345,
            prevHash: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            currHash: "some message",
            transactions: [transaction],
            merkleRoot: "some message",
            showTrans: true,
            valid: false
          }
        ]
      }
    });

    expect(screen.getByRole("textbox", { name: /Block Transactions Signature/i })).toHaveValue("some message");

    expect(asFragment()).toMatchSnapshot();
  });
});
