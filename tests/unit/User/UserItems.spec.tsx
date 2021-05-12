import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import UserItems from "../../../src/components/User/UserItems";
import { AppContext } from "../../../src/context/AppContext";
import { act } from "react-dom/test-utils";

const { state, dispatch } = global;

it("renders correctly", () => {
  render(
    <AppContext.Provider value={{ state, dispatch }}>
      <UserItems />
    </AppContext.Provider>
  );

  const title = screen.getByRole("heading", { name: /users/i, level: 3 });
  const publicKey = screen.getByRole("textbox", { name: /publicKey/i }) as HTMLInputElement;
  const balance = screen.getAllByRole("spinbutton", { name: /balance/i }) as HTMLInputElement[];

  expect(title).toBeInTheDocument;

  expect(balance[0]).toBeDisabled();
  expect(balance[0].value).toEqual("1000");
  expect(balance.length).toEqual(1);

  expect(publicKey).not.toBeDisabled();
  expect(publicKey.value.length).toEqual(182);

  expect(screen).toMatchSnapshot();
});

it("shows 'copied to clipboard' when public key field is focused", () => {
  document.execCommand = jest.fn();

  render(
    <AppContext.Provider value={{ state, dispatch }}>
      <UserItems />
    </AppContext.Provider>
  );

  const publicKey = screen.getByRole("textbox", { name: /publicKey/i }) as HTMLInputElement;
  expect(publicKey).not.toHaveClass("is-valid");
  act(() => publicKey.focus());
  expect(publicKey).toHaveClass("is-valid");
  expect(publicKey).toHaveFocus();
});
