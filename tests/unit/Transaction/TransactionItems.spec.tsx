import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import TransactionItems from "../../../src/components/Transaction/TransactionItems";
import { AppContext } from "../../../src/context/AppContext";
import { ACTIONS } from "../../../src/enums/AppDispatchActions";
import { IState } from "../../../src/typings/AppTypes";

it("renders correctly", () => {
  const { state, dispatch } = global;

  const { asFragment } = render(
    <AppContext.Provider value={{ state, dispatch }}>
      <TransactionItems />
    </AppContext.Provider>
  );

  const transactions = screen.getAllByRole("form", { name: /Transaction Information/i });
  const fromFields = screen.getAllByRole("textbox", { name: /Transaction From/i });
  const toFields = screen.getAllByRole("textbox", { name: /Transaction To/i });
  const msgFields = screen.getAllByRole("textbox", { name: /Transaction Message/i });
  const balances = screen.getAllByRole("spinbutton", { name: /Transaction Amount/i });
  const sigFields = screen.getAllByRole("textbox", { name: /Transaction Signature/i });

  expect(screen.getByRole("heading", { name: /Title/i, level: 3 })).toHaveTextContent("Verified Transactions");

  transactions.forEach((transaction, i) => {
    expect(transaction).toHaveFormValues(state.verifiedTrans[i]);
  });

  [...fromFields, ...toFields, ...msgFields, ...sigFields].forEach((field) => {
    expect(field).toHaveAttribute("readOnly");
    expect(field).not.toBeRequired();
  });

  balances.forEach((balance) => {
    expect(balance).toBeDisabled();
    expect(balance).not.toBeRequired();
  });

  const numTrans = state.verifiedTrans.length;
  expect(transactions.length).toEqual(numTrans);
  expect(fromFields.length).toEqual(numTrans);
  expect(toFields.length).toEqual(numTrans);
  expect(msgFields.length).toEqual(numTrans);
  expect(balances.length).toEqual(numTrans);
  expect(sigFields.length).toEqual(numTrans);

  expect(asFragment()).toMatchSnapshot();
});

describe("Select Transaction", () => {
  const { state } = global;
  const dispatch = jest.fn();

  describe("Less than 4 already selected", () => {
    beforeEach(() => {
      render(
        <AppContext.Provider value={{ state, dispatch }}>
          <TransactionItems />
        </AppContext.Provider>
      );
    });

    afterEach(() => jest.clearAllMocks());

    it("adds selected transaction if not already selected", () => {
      const transactions = screen.getAllByRole("form", { name: /Transaction Information/i });
      const fromFields = screen.getAllByRole("textbox", { name: /Transaction From/i }) as HTMLInputElement[];
      const toFields = screen.getAllByRole("textbox", { name: /Transaction To/i }) as HTMLInputElement[];
      const msgFields = screen.getAllByRole("textbox", { name: /Transaction Message/i }) as HTMLTextAreaElement[];
      const balances = screen.getAllByRole("spinbutton", { name: /Transaction Amount/i }) as HTMLInputElement[];
      const sigFields = screen.getAllByRole("textbox", { name: /Transaction Signature/i }) as HTMLInputElement[];

      const newSelected = {
        amount: +balances[0].value,
        from: fromFields[0].value,
        message: msgFields[0].value,
        signature: sigFields[0].value,
        to: toFields[0].value
      };

      const selectedTrans = [...state.selectedTrans, newSelected]; // expected

      fireEvent.click(transactions[0]);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: ACTIONS.UPDATE_SELECTED_TRANS, payload: { selectedTrans } });
    });

    it("removes selected transaction from the list if already selected", () => {
      const transactions = screen.getAllByRole("form", { name: /Transaction Information/i });

      fireEvent.click(transactions[1]);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: ACTIONS.UPDATE_SELECTED_TRANS, payload: { selectedTrans: [] } });
    });
  });

  describe("4 or more already selected", () => {
    let ogState: IState;

    beforeAll(() => {
      ogState = JSON.parse(JSON.stringify(state));
      ogState.selectedTrans.push(...ogState.verifiedTrans.slice(2));
    });

    beforeEach(() => {
      render(
        <AppContext.Provider value={{ state: ogState, dispatch }}>
          <TransactionItems />
        </AppContext.Provider>
      );
    });

    afterEach(() => jest.clearAllMocks());

    it("alerts", () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => undefined);

      const transactions = screen.getAllByRole("form", { name: /Transaction Information/i });
      fireEvent.click(transactions[0]);

      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith("You can mine at most 4 transactions at a time!");
    });

    it("removes the selectedTrans from the list without alerting if the clicked transaction matches it", () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => undefined);

      const transactions = screen.getAllByRole("form", { name: /Transaction Information/i });
      const selectedTrans = ogState.selectedTrans.slice(0, ogState.selectedTrans.length - 1); // expected

      fireEvent.click(transactions[transactions.length - 1]);

      expect(alertSpy).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: ACTIONS.UPDATE_SELECTED_TRANS, payload: { selectedTrans } });
    });
  });
});
