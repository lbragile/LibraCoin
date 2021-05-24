import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import UserItems from "../../../src/components/User/UserItems";
import { AppContext } from "../../../src/context/AppContext";

const { state, dispatch } = global;

it("renders correctly", () => {
  const { asFragment } = render(
    <AppContext.Provider value={{ state, dispatch }}>
      <UserItems />
    </AppContext.Provider>
  );

  const title = screen.getByRole("heading", { name: /Users/i, level: 3 });
  const publicKeys = screen.getAllByRole("textbox", { name: /User Public Key/i }) as HTMLInputElement[];
  const balances = screen.getAllByRole("spinbutton", { name: /balance/i }) as HTMLInputElement[];

  expect(title).toBeInTheDocument();

  balances.forEach((balance, i) => {
    expect(balance).toBeDisabled();
    expect(balance.value).toEqual(state.users[i].balance.toString());
  });

  publicKeys.forEach((key) => {
    expect(key).toHaveAttribute("readOnly");
    expect(key.value.length).toEqual(state.user.publicKey.length);
  });

  expect(publicKeys.length).toEqual(state.users.length);
  expect(balances.length).toEqual(state.users.length);

  expect(asFragment()).toMatchSnapshot();
});

describe("public key of user - copy/blur", () => {
  beforeEach(() => {
    document.execCommand = jest.fn();

    render(
      <AppContext.Provider value={{ state, dispatch }}>
        <UserItems />
      </AppContext.Provider>
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shows 'copied to clipboard' on the correct key when public key field is focused", () => {
    const publicKeyFields = screen.getAllByRole("textbox", { name: /User Public Key/i });
    publicKeyFields.forEach((key) => {
      expect(key).not.toHaveClass("is-valid");
    });

    publicKeyFields[1].focus();

    expect(publicKeyFields[0]).not.toHaveFocus();
    expect(publicKeyFields[1]).toHaveFocus();
    expect(publicKeyFields[2]).not.toHaveFocus();

    expect(publicKeyFields[0]).not.toHaveClass("is-valid");
    expect(publicKeyFields[1]).toHaveClass("is-valid");
    expect(publicKeyFields[2]).not.toHaveClass("is-valid");
  });

  it("removes 'copied to clipboard' from the correct key when focus is lost", () => {
    const publicKeyFields = screen.getAllByRole("textbox", { name: /User Public Key/i });
    publicKeyFields.forEach((key) => {
      expect(key).not.toHaveClass("is-valid");
    });

    publicKeyFields[1].focus();

    expect(publicKeyFields[0]).not.toHaveFocus();
    expect(publicKeyFields[1]).toHaveFocus();
    expect(publicKeyFields[2]).not.toHaveFocus();

    expect(publicKeyFields[0]).not.toHaveClass("is-valid");
    expect(publicKeyFields[1]).toHaveClass("is-valid");
    expect(publicKeyFields[2]).not.toHaveClass("is-valid");

    publicKeyFields[1].blur();

    publicKeyFields.forEach((key) => {
      expect(key).not.toHaveFocus();
      expect(key).not.toHaveClass("is-valid");
    });
  });
});
