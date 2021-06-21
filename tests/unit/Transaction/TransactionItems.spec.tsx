/**
 * @group unit
 */

import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TransactionItems from "../../../src/components/Transaction/TransactionItems";
import { ACTIONS } from "../../../src/enums/AppDispatchActions";

import * as TreeUtils from "../../../src/utils/merkleTree";
import { customRender } from "../../utils/testUtils";

const { initialState } = global;

it("renders correctly", () => {
  const { asFragment } = customRender(<TransactionItems />);

  const transactions = screen.getAllByRole("form", { name: /Transaction Information/i });
  const fromFields = screen.getAllByRole("textbox", { name: /Transaction From/i });
  const toFields = screen.getAllByRole("textbox", { name: /Transaction To/i });
  const msgFields = screen.getAllByRole("textbox", { name: /Transaction Message/i });
  const balances = screen.getAllByRole("spinbutton", { name: /Transaction Amount/i });
  const sigFields = screen.getAllByRole("textbox", { name: /Transaction Signature/i });

  expect(screen.getByRole("heading", { name: /Title/i, level: 3 })).toHaveTextContent("Verified Transactions");

  transactions.forEach((transaction, i) => expect(transaction).toHaveFormValues({ ...initialState.verifiedTrans[i] }));

  [...fromFields, ...toFields, ...msgFields, ...sigFields].forEach((field) => {
    expect(field).toHaveAttribute("readOnly");
    expect(field).not.toBeRequired();
  });

  balances.forEach((balance) => {
    expect(balance).toBeDisabled();
    expect(balance).not.toBeRequired();
  });

  const numTrans = initialState.verifiedTrans.length;
  expect(transactions.length).toEqual(numTrans);
  expect(fromFields.length).toEqual(numTrans);
  expect(toFields.length).toEqual(numTrans);
  expect(msgFields.length).toEqual(numTrans);
  expect(balances.length).toEqual(numTrans);
  expect(sigFields.length).toEqual(numTrans);

  expect(asFragment()).toMatchSnapshot();
});

describe("Select Transaction", () => {
  const dispatchMock = jest.fn();

  describe("Less than 4 already selected", () => {
    beforeEach(() => customRender(<TransactionItems />, { dispatchMock }));
    afterEach(() => jest.clearAllMocks());

    it("adds selected transaction if not already selected", async () => {
      const transactions = screen.getAllByRole("form", { name: /Transaction Information/i });
      const fromFields = screen.getAllByRole("textbox", { name: /Transaction From/i }) as HTMLInputElement[];
      const toFields = screen.getAllByRole("textbox", { name: /Transaction To/i }) as HTMLInputElement[];
      const msgFields = screen.getAllByRole("textbox", { name: /Transaction Message/i }) as HTMLTextAreaElement[];
      const balances = screen.getAllByRole("spinbutton", { name: /Transaction Amount/i }) as HTMLInputElement[];
      const sigFields = screen.getAllByRole("textbox", { name: /Transaction Signature/i }) as HTMLInputElement[];

      const newSelected = {
        amount: +balances[0].value,
        from: fromFields[0].value,
        msg: msgFields[0].value,
        signature: sigFields[0].value,
        to: toFields[0].value
      };

      // new merkleRoot will be just the transaction signature since only 1 selected
      jest.spyOn(TreeUtils, "calculateMerkleTreeFormation").mockResolvedValueOnce([[sigFields[0].value]]);
      const newPreview = { ...initialState.preview, merkleRoot: sigFields[0].value, valid: false };

      const selectedTrans = [...initialState.selectedTrans, newSelected]; // expected

      userEvent.click(transactions[0]);

      await waitFor(() => expect(dispatchMock).toHaveBeenCalledTimes(2));

      expect(dispatchMock).toHaveBeenNthCalledWith(1, {
        type: ACTIONS.UPDATE_SELECTED_TRANS,
        payload: { selectedTrans }
      });

      expect(dispatchMock).toHaveBeenNthCalledWith(2, {
        type: ACTIONS.UPDATE_PREVIEW,
        payload: { preview: newPreview }
      });
    });

    it("removes selected transaction from the list if already selected", async () => {
      const transactions = screen.getAllByRole("form", { name: /Transaction Information/i });

      jest.spyOn(TreeUtils, "calculateMerkleTreeFormation").mockResolvedValueOnce([[""]]);
      const newPreview = { ...initialState.preview, merkleRoot: "", valid: false };

      userEvent.click(transactions[1]);

      await waitFor(() => expect(dispatchMock).toHaveBeenCalledTimes(2));

      expect(dispatchMock).toHaveBeenNthCalledWith(1, {
        type: ACTIONS.UPDATE_SELECTED_TRANS,
        payload: { selectedTrans: [] }
      });

      expect(dispatchMock).toHaveBeenNthCalledWith(2, {
        type: ACTIONS.UPDATE_PREVIEW,
        payload: { preview: newPreview }
      });
    });
  });

  describe("4 or more already selected", () => {
    const dispatchMock = jest.fn();
    const ogState = JSON.parse(JSON.stringify(initialState));
    ogState.selectedTrans.push(...ogState.verifiedTrans.slice(2));

    beforeEach(() => customRender(<TransactionItems />, { stateMock: ogState, dispatchMock }));
    afterEach(() => jest.clearAllMocks());

    it("alerts", () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => undefined);

      const transactions = screen.getAllByRole("form", { name: /Transaction Information/i });
      userEvent.click(transactions[0]);

      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith("You can mine at most 4 transactions at a time!");
    });

    it("removes the selectedTrans from the list without alerting if the clicked transaction matches it", async () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => undefined);

      const transactions = screen.getAllByRole("form", { name: /Transaction Information/i });
      const selectedTrans = ogState.selectedTrans.slice(0, ogState.selectedTrans.length - 1); // expected

      jest.spyOn(TreeUtils, "calculateMerkleTreeFormation").mockResolvedValueOnce([["randomRoot"]]);
      const newPreview = { ...initialState.preview, merkleRoot: "randomRoot", valid: false };

      userEvent.click(transactions[transactions.length - 1]);

      await waitFor(() => expect(dispatchMock).toHaveBeenCalledTimes(2));

      expect(dispatchMock).toHaveBeenNthCalledWith(1, {
        type: ACTIONS.UPDATE_SELECTED_TRANS,
        payload: { selectedTrans }
      });

      expect(dispatchMock).toHaveBeenNthCalledWith(2, {
        type: ACTIONS.UPDATE_PREVIEW,
        payload: { preview: newPreview }
      });

      expect(alertSpy).not.toHaveBeenCalled();
    });
  });
});
