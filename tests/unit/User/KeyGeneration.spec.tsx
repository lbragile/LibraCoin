/**
 * @group unit
 */

import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import KeyGeneration from "../../../src/components/User/KeyGeneration";
import { customRender } from "../../utils/testUtils";
import * as CopyInputUtil from "../../../src/utils/copyInput";
import * as ConversionUtil from "../../../src/utils/conversion";

const { initialState, exportKeyMock, generateKeyMock } = global;

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
  const { asFragment } = customRender(<KeyGeneration />);

  expect(await screen.findByRole("textbox", { name: /publicKey/i })).toBeInTheDocument();
  expect(await screen.findByRole("textbox", { name: /privateKey/i })).toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});

describe("input field text", () => {
  const privateKey = initialState.user.privateKey;
  const privateKeyHidden = new Array(privateKey.length).fill("◦").join("");

  beforeEach(() =>
    jest
      .spyOn(ConversionUtil, "CryptoKeyToHex")
      .mockResolvedValueOnce(initialState.user.publicKey)
      .mockResolvedValueOnce(initialState.user.privateKey)
  );

  it("has no user in localStorage", async () => {
    customRender(<KeyGeneration />, {
      stateMock: { ...initialState, user: { privateKey: "", publicKey: "", balance: 1000 } }
    });

    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveValue(initialState.user.publicKey)
    );
    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKeyHidden);
    expect(screen.getByText("👀")).toBeInTheDocument();
  });

  it("has user in localStorage", async () => {
    customRender(<KeyGeneration />);

    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveValue(initialState.user.publicKey)
    );
    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKeyHidden);
    expect(screen.getByText("👀")).toBeInTheDocument();
  });

  it("reveals private key on eye click", async () => {
    customRender(<KeyGeneration />);

    await waitFor(() => expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKeyHidden));

    fireEvent.click(screen.getByText("👀"));

    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKey);
    expect(screen.getByText("👀")).toBeInTheDocument();
  });
});

describe("copy input of key fields", () => {
  document.execCommand = jest.fn();
  beforeEach(() => customRender(<KeyGeneration />));

  test("public key copy", () => {
    const copyInputSpy = jest.spyOn(CopyInputUtil, "copyInput");

    // both don't have feedback
    expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
    expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");

    fireEvent.focus(screen.getByRole("textbox", { name: /publicKey/i }));

    // public has feedback while private doesn't
    expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveClass("is-valid");
    expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");

    expect(copyInputSpy).toHaveBeenCalledTimes(1);
    expect(copyInputSpy).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement), "walletPK", expect.any(Function));

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
      const copyInputSpy = jest.spyOn(CopyInputUtil, "copyInput");

      // both don't have feedback
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");

      fireEvent.click(screen.getByText("👀"));

      expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(initialState.user.privateKey);

      fireEvent.focus(screen.getByRole("textbox", { name: /privateKey/i }));

      // private has feedback while public doesn't
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveClass("is-valid");

      expect(copyInputSpy).toHaveBeenCalledTimes(1);
      expect(copyInputSpy).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement), "walletSK", expect.any(Function));

      fireEvent.blur(screen.getByRole("textbox", { name: /privateKey/i }));

      // after blur, both do not have feedback
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");
    });
  });
});
