/**
 * @group unit
 */

import React, { useReducer } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import KeyGeneration from "../../../src/components/User/KeyGeneration";
import { AppContext } from "../../../src/context/AppContext";
import * as utilsFunc from "../../../src/utils/copyInput";
import { IAction, IState } from "../../../src/typings/AppTypes";
import { AppReducer } from "../../../src/reducers/AppReducer";

const { initialState, exportKeyMock, generateKeyMock } = global;

interface IKeyGenerationWrapper {
  stateMock?: IState;
  dispatchMock?: React.Dispatch<IAction>;
}

const KeyGenerationWrapper = ({ stateMock, dispatchMock }: IKeyGenerationWrapper) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state: stateMock ?? state, dispatch: dispatchMock ?? dispatch }}>
      <KeyGeneration />
    </AppContext.Provider>
  );
};

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

it("renders correctly", async () => {
  const { asFragment } = render(<KeyGenerationWrapper />);

  expect(await screen.findByRole("textbox", { name: /publicKey/i })).toBeInTheDocument();
  expect(await screen.findByRole("textbox", { name: /privateKey/i })).toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});

describe("input field text", () => {
  const privateKey = initialState.user.privateKey;
  const privateKeyHidden = new Array(privateKey.length).fill("◦").join("");

  it("has no user in localStorage", async () => {
    render(
      <KeyGenerationWrapper stateMock={{ ...initialState, user: { privateKey: "", publicKey: "", balance: 1000 } }} />
    );

    expect(await screen.findByText("👀")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveValue(initialState.user.publicKey);
    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue("");
  });

  it("has user in localStorage", async () => {
    render(<KeyGenerationWrapper />);

    expect(await screen.findByText("👀")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveValue(initialState.user.publicKey);
    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKeyHidden);
  });

  it("reveals private key on eye click", async () => {
    render(<KeyGenerationWrapper />);

    expect(await screen.findByText("👀")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKeyHidden);

    fireEvent.click(screen.getByText("👀"));

    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKey);
  });
});

describe("copy input of key fields", () => {
  document.execCommand = jest.fn();
  beforeEach(() => render(<KeyGenerationWrapper />));
  afterEach(() => jest.clearAllMocks());

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

      expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(initialState.user.privateKey);

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
