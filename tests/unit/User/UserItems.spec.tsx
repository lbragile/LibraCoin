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

  const title = screen.getByRole("heading", { name: /Users/i, level: 3 });
  const publicKey = screen.getByRole("textbox", { name: /User Public Key/i }) as HTMLInputElement;
  const balance = screen.getAllByRole("spinbutton", { name: /balance/i }) as HTMLInputElement[];

  expect(title).toBeInTheDocument;

  expect(balance[0]).toBeDisabled();
  expect(balance[0].value).toEqual("1000");
  expect(balance.length).toEqual(1);

  expect(publicKey).toBeEnabled();
  expect(publicKey.value.length).toEqual(state.user.publicKey.length);

  expect(asFragment()).toMatchSnapshot();
});

it("shows 'copied to clipboard' when public key field is focused", () => {
  document.execCommand = jest.fn();

  render(
    <AppContext.Provider value={{ state, dispatch }}>
      <UserItems />
    </AppContext.Provider>
  );

  let publicKeyField = screen.getByRole("textbox", { name: /User Public Key/i });
  expect(publicKeyField).not.toHaveClass("is-valid");

  publicKeyField.focus();

  publicKeyField = screen.getByRole("textbox", { name: /User Public Key/i });
  expect(publicKeyField).toHaveFocus();
  expect(publicKeyField).toHaveClass("is-valid");
});
