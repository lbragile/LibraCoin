/**
 * @group integration
 */

import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as ConversionUtil from "../../src/utils/conversion";
import Wallet from "../../src/pages/Wallet";
import { customRender } from "../utils/testUtils";

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
  const { asFragment } = customRender(<Wallet />);

  expect(await screen.findByRole("textbox", { name: /publicKey/i })).toBeInTheDocument();
  expect(await screen.findByRole("textbox", { name: /privateKey/i })).toBeInTheDocument();

  expect(screen.getByRole("form", { name: /Sign Form/i })).toHaveFormValues({
    from: initialState.user.publicKey,
    to: "",
    amount: null,
    msg: "",
    fromSK: initialState.user.privateKey
  });

  expect(screen.getByRole("button", { name: /Sign Button/i })).toBeEnabled();
  expect(screen.getByRole("button", { name: /Sign Button/i })).toHaveTextContent("Sign");
  expect(screen.getByRole("button", { name: /Sign Button/i })).toHaveClass("btn-primary");

  expect(screen.getByRole("form", { name: /Send Form/i })).toHaveFormValues({
    "receiver-pk": "",
    amount: 0,
    msg: "",
    sig: ""
  });

  expect(screen.getByRole("button", { name: /Send Button/i })).toBeDisabled();
  expect(screen.getByRole("button", { name: /Send Button/i })).toHaveTextContent("Send");
  expect(screen.getByRole("button", { name: /Send Button/i })).toHaveClass("btn-primary");

  expect(screen.getByRole("heading", { name: /Users/i, level: 3 })).toHaveTextContent("Users");
  expect(screen.getAllByRole("textbox", { name: /User Public Key/i })).toHaveLength(initialState.users.length);
  expect(screen.getAllByRole("spinbutton", { name: /balance/i })).toHaveLength(initialState.users.length);

  expect(asFragment()).toMatchSnapshot();
});

it("copies public key on focus, pages and fills out sign form, signs, sends", async () => {
  document.execCommand = jest.fn();
  jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValue("random message");

  const { asFragment } = customRender(<Wallet />);

  const pkInput = await screen.findByRole("textbox", { name: /publicKey/i });
  expect(pkInput).toBeInTheDocument();

  userEvent.click(pkInput);
  const copiedText = await screen.findAllByText("Copied to clipboard!");
  expect(copiedText[0]).toBeVisible();

  expect(asFragment()).toMatchSnapshot();

  /* Fill out the form */
  userEvent.type(screen.getAllByRole("textbox", { name: /Receiver PK/i })[0], initialState.users[1].publicKey);
  userEvent.type(screen.getByRole("spinbutton", { name: /Sign Amount/i }), "111");
  userEvent.type(screen.getByRole("textbox", { name: /Sign Message/i }), "aaa");
  await waitFor(() => expect(screen.getByRole("textbox", { name: /Sign Message/i })).toHaveValue("aaa"));

  expect(asFragment()).toMatchSnapshot();

  /* Sign & Send */
  const signButton = screen.getByRole("button", { name: /Sign Button/i });
  const sendButton = screen.getByRole("button", { name: /Send Button/i });

  expect(signButton).toBeEnabled();
  expect(signButton).toHaveTextContent("Sign");
  expect(signButton).toHaveClass("btn-primary");

  expect(sendButton).toBeDisabled();
  expect(sendButton).toHaveTextContent("Send");
  expect(sendButton).toHaveClass("btn-primary");

  userEvent.click(signButton);

  await waitFor(() => expect(signButton).toBeDisabled());
  await waitFor(() => expect(signButton).toHaveTextContent("Signed"));
  await waitFor(() => expect(signButton).toHaveClass("btn-success"));

  expect(asFragment()).toMatchSnapshot();

  expect(screen.getByRole("form", { name: /Send Form/i })).toHaveFormValues({
    amount: 111,
    msg: "aaa",
    "receiver-pk": initialState.users[1].publicKey,
    sig: "random message"
  });

  expect(sendButton).toBeEnabled();
  expect(sendButton).toHaveTextContent("Send");
  expect(sendButton).toHaveClass("btn-primary");

  userEvent.click(sendButton);

  await waitFor(() => expect(sendButton).toBeDisabled());
  await waitFor(() => expect(sendButton).toHaveTextContent("Sent"));
  await waitFor(() => expect(sendButton).toHaveClass("btn-success"));

  expect(signButton).toBeEnabled();
  expect(signButton).toHaveTextContent("Sign");
  expect(signButton).toHaveClass("btn-primary");

  // verify form value are correct
  expect(screen.getByRole("form", { name: /Sign Form/i })).toHaveFormValues({
    from: initialState.user.publicKey,
    to: initialState.users[1].publicKey,
    amount: 111,
    msg: "aaa",
    fromSK: initialState.user.privateKey
  });

  expect(screen.getByRole("form", { name: /Send Form/i })).toHaveFormValues({
    amount: 0,
    msg: "",
    "receiver-pk": "",
    sig: ""
  });

  expect(asFragment()).toMatchSnapshot();
});
