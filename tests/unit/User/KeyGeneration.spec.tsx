/**
 * @group unit
 */

import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
    expect(await screen.findByRole("img", { name: /Key Reveal Eye/i })).toBeInTheDocument();
  });

  it("has user in localStorage", async () => {
    customRender(<KeyGeneration />);

    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveValue(initialState.user.publicKey)
    );
    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKeyHidden);
    expect(await screen.findByRole("img", { name: /Key Reveal Eye/i })).toBeInTheDocument();
  });

  it("reveals private key on eye click", async () => {
    customRender(<KeyGeneration />);

    await waitFor(() => expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKeyHidden));

    userEvent.click(await screen.findByRole("img", { name: /Key Reveal Eye/i }));

    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKey);
    expect(await screen.findByRole("img", { name: /Key Reveal Eye/i })).toBeInTheDocument();
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

    // why element.focus() instead of fireEvent.focus()? https://testing-library.com/docs/guide-events/#focusblur
    screen.getByRole("textbox", { name: /publicKey/i }).focus();

    // public has feedback while private doesn't
    expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveClass("is-valid");
    expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");

    expect(copyInputSpy).toHaveBeenCalledTimes(1);
    expect(copyInputSpy).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement), "walletPK", expect.any(Function));

    screen.getByRole("textbox", { name: /publicKey/i }).blur();

    // after blur, both do not have feedback
    expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
    expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");
  });

  describe("private key copy", () => {
    test("when hidden", () => {
      // both don't have feedback
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");

      screen.getByRole("textbox", { name: /privateKey/i }).focus();

      // both don't have feedback
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveFocus();
    });

    test("when visible", async () => {
      const copyInputSpy = jest.spyOn(CopyInputUtil, "copyInput");

      // both don't have feedback
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");

      userEvent.click(await screen.findByRole("img", { name: /Key Reveal Eye/i }));

      expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(initialState.user.privateKey);

      screen.getByRole("textbox", { name: /privateKey/i }).focus();

      // private has feedback while public doesn't
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveClass("is-valid");

      expect(copyInputSpy).toHaveBeenCalledTimes(1);
      expect(copyInputSpy).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement), "walletSK", expect.any(Function));

      screen.getByRole("textbox", { name: /privateKey/i }).blur();

      // after blur, both do not have feedback
      expect(screen.getByRole("textbox", { name: /publicKey/i })).not.toHaveClass("is-valid");
      expect(screen.getByRole("textbox", { name: /privateKey/i })).not.toHaveClass("is-valid");
    });
  });
});
