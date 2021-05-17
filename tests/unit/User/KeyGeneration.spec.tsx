import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import KeyGeneration from "../../../src/components/User/KeyGeneration";
import { AppContext } from "../../../src/context/AppContext";

const { state, dispatch, exportKeyMock, generateKeyMock } = global;

beforeAll(() => {
  Object.defineProperty(window, "crypto", {
    value: { subtle: { exportKey: exportKeyMock, generateKey: generateKeyMock } },
    configurable: true
  });
});

afterAll(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  delete window.crypto;
});

it("renders correctly", () => {
  const { asFragment } = render(
    <AppContext.Provider value={{ state, dispatch }}>
      <KeyGeneration />
    </AppContext.Provider>
  );

  expect(screen.getByRole("textbox", { name: /publicKey/i })).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: /privateKey/i })).toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});

describe("input field text", () => {
  const privateKey = state.user.privateKey;
  const privateKeyHidden = new Array(privateKey.length).fill("◦").join("");

  it("has no user in localStorage", () => {
    const ogState = JSON.parse(JSON.stringify(state));
    ogState.user = {};
    render(
      <AppContext.Provider value={{ state: ogState, dispatch }}>
        <KeyGeneration />
      </AppContext.Provider>
    );

    expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue("");
    expect(screen.getByText("👀")).toBeInTheDocument();
  });

  it("has user in localStorage", () => {
    render(
      <AppContext.Provider value={{ state, dispatch }}>
        <KeyGeneration />
      </AppContext.Provider>
    );

    expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveValue(state.user.publicKey);
    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKeyHidden);
    expect(screen.getByText("👀")).toBeInTheDocument();
  });

  it("reveals private key on eye click", () => {
    render(
      <AppContext.Provider value={{ state, dispatch }}>
        <KeyGeneration />
      </AppContext.Provider>
    );

    expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveValue(state.user.publicKey);
    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKeyHidden);

    fireEvent.click(screen.getByText("👀"));

    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKey);
  });
});
