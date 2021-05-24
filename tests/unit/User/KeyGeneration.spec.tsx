import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import KeyGeneration from "../../../src/components/User/KeyGeneration";
import { AppContext } from "../../../src/context/AppContext";
import * as utilsFunc from "../../../src/utils/copyInput";

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

describe("copy input of key fields", () => {
  document.execCommand = jest.fn();

  beforeEach(() => {
    render(
      <AppContext.Provider value={{ state, dispatch }}>
        <KeyGeneration />
      </AppContext.Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("public key copy", () => {
    const copyKeySpy = jest.spyOn(utilsFunc, "copyKey");

    // both don't have feedback
    expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
    expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");

    fireEvent.focus(screen.getByRole("textbox", { name: /publicKey/i }));

    // public has feedback while private doesn't
    expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveClass("is-valid");
    expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");

    expect(copyKeySpy).toHaveBeenCalledTimes(1);
    expect(copyKeySpy).toHaveBeenCalledWith(expect.objectContaining({ type: "focus" }), expect.any(Function), "public");

    fireEvent.blur(screen.getByRole("textbox", { name: /publicKey/i }));

    // after blur, both do not have feedback
    expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
    expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");
  });

  describe("private key copy", () => {
    test("when hidden", () => {
      // both don't have feedback
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");

      fireEvent.focus(screen.getByRole("textbox", { name: /privateKey/i }));

      // both don't have feedback
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveFocus();
    });

    test("when visible", () => {
      const copyKeySpy = jest.spyOn(utilsFunc, "copyKey");

      // both don't have feedback
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");

      fireEvent.click(screen.getByText("👀"));
      fireEvent.focus(screen.getByRole("textbox", { name: /privateKey/i }));

      // private has feedback while public doesn't
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveClass("is-valid");

      expect(copyKeySpy).toHaveBeenCalledTimes(1);
      expect(copyKeySpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "focus" }),
        expect.any(Function),
        "private"
      );

      fireEvent.blur(screen.getByRole("textbox", { name: /privateKey/i }));

      // after blur, both do not have feedback
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");
    });
  });
});
