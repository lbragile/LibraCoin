import React from "react";
import UserItems from "../../../src/components/User/UserItems";
import { AppContext } from "../../../src/context/AppContext";
import { fireEvent, render } from "@testing-library/react";

const { state, dispatch } = global;

it("renders correctly", () => {
  const { getByText, container } = render(
    <AppContext.Provider value={{ state, dispatch }}>
      <UserItems />
    </AppContext.Provider>
  );

  const title = getByText("Users");
  const users = container.querySelectorAll(".user-item");
  const balance = container.querySelector("input[type='number']") as HTMLInputElement;
  const publicKey = container.querySelector("input[type='text']") as HTMLInputElement;

  expect(title.textContent).toBe("Users");
  expect(balance.value).toEqual("1000");
  expect(publicKey.value.length).toEqual(182);
  expect(users.length).toEqual(1);
  expect(container).toMatchSnapshot();
});

it("shows 'copied to clipboard' when public key field is focused", () => {
  document.execCommand = jest.fn();

  const { container } = render(
    <AppContext.Provider value={{ state, dispatch }}>
      <UserItems />
    </AppContext.Provider>
  );

  const publicKeyBefore = container.querySelector("input[type='text']") as HTMLInputElement;
  fireEvent.focus(publicKeyBefore);
  const publicKeyAfter = container.querySelector("input[type='text']") as HTMLInputElement;

  expect(publicKeyBefore.classList).not.toContain("is-valid");
  expect(publicKeyAfter.classList).toContain("is-valid");
});
