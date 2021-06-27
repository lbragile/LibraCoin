/**
 * @group unit
 */

import React from "react";
import { screen } from "@testing-library/react";

import UserItems from "../../../src/components/User/UserItems";
import { customRender } from "../../utils/testUtils";

const { initialState } = global;

it("renders correctly", () => {
  const { asFragment } = customRender(<UserItems />);

  const publicKeys = screen.getAllByRole("textbox", { name: /User Public Key/i });
  const balances = screen.getAllByRole("spinbutton", { name: /balance/i });

  expect(screen.getByRole("heading", { name: /Users/i, level: 3 })).toHaveTextContent("Users");

  balances.forEach((balance, i) => {
    expect(balance).toBeDisabled();
    expect(balance).toHaveValue(initialState.users[i].balance);
  });

  publicKeys.forEach((key, i) => {
    expect(key).toHaveAttribute("readOnly");
    expect(key).toHaveValue(initialState.users[i].publicKey);
  });

  const numUsers = initialState.users.length;
  expect(publicKeys.length).toEqual(numUsers);
  expect(balances.length).toEqual(numUsers);

  expect(asFragment()).toMatchSnapshot();
});

describe("public key of user - copy/blur", () => {
  beforeEach(() => {
    document.execCommand = jest.fn();
    customRender(<UserItems />);
  });

  it("shows 'copied to clipboard' on the correct key when public key field is focused", () => {
    const publicKeyFields = screen.getAllByRole("textbox", { name: /User Public Key/i });
    publicKeyFields.forEach((key) => expect(key).not.toHaveClass("is-valid"));

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
    publicKeyFields.forEach((key) => expect(key).not.toHaveClass("is-valid"));

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
