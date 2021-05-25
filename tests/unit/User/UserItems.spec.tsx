import React from "react";
import { render, screen } from "@testing-library/react";
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

  const publicKeys = screen.getAllByRole("textbox", { name: /User Public Key/i });
  const balances = screen.getAllByRole("spinbutton", { name: /balance/i });

  expect(screen.getByRole("heading", { name: /Users/i, level: 3 })).toHaveTextContent("Users");

  balances.forEach((balance, i) => {
    expect(balance).toBeDisabled();
    expect(balance).toHaveValue(state.users[i].balance);
  });

  publicKeys.forEach((key, i) => {
    expect(key).toHaveAttribute("readOnly");
    expect(key).toHaveValue(state.users[i].publicKey);
  });

  const numUsers = state.users.length;
  expect(publicKeys.length).toEqual(numUsers);
  expect(balances.length).toEqual(numUsers);

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
