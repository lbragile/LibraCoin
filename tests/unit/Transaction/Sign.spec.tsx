/**
 * @group unit
 */

import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Sign from "../../../src/components/Transaction/Sign";
import * as conversionUtils from "../../../src/utils/conversion";
import { customRender } from "../../utils/testUtils";
import { numberWithCommas } from "../../../src/utils/numberManipulation";

const { initialState } = global;

it("renders correctly", () => {
  const { asFragment } = customRender(<Sign />);

  expect(screen.getByRole("form", { name: /Sign Form/i })).toHaveFormValues({
    from: initialState.user.publicKey,
    to: "",
    amount: null,
    msg: "",
    fromSK: initialState.user.privateKey
  });

  const senderPublicKey = screen.getByRole("textbox", { name: /Sender Public Key/i });
  expect(senderPublicKey).toHaveAttribute("readOnly");
  expect(senderPublicKey).not.toBeRequired();

  expect(screen.getByText(/Used to verify/i)).toBeInTheDocument();

  const receiverPublicKey = screen.getByRole("textbox", { name: /Receiver PK/i });
  expect(receiverPublicKey).toBeEnabled();
  expect(receiverPublicKey).toBeRequired();

  const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
  expect(signAmount).toBeEnabled();
  expect(signAmount).toHaveAttribute("placeholder", "1.00");
  expect(signAmount).toBeRequired();

  const signMessage = screen.getByRole("textbox", { name: /Sign Message/i });
  expect(signMessage).toBeEnabled();
  expect(signMessage).toHaveAttribute("placeholder", "optional message...");
  expect(signMessage).not.toBeRequired();

  const senderPrivateKey = screen.getByRole("textbox", { name: /Sender Private Key/i });
  expect(senderPrivateKey).toHaveAttribute("readOnly");
  expect(senderPrivateKey).not.toBeRequired();

  expect(screen.getByText(/Not shared with/i)).toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});

describe("sign button state", () => {
  it("is enabled when not signed", () => {
    customRender(<Sign />);

    // fill out the form
    userEvent.type(
      screen.getByRole("textbox", { name: /Receiver PK/i }),
      new Array(initialState.user.publicKey.length).fill("A").join("")
    );

    userEvent.type(screen.getByRole("spinbutton", { name: /Sign Amount/i }), Number(12.31).toFixed(2));

    expect(screen.getByRole("button", { name: /Sign Button/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Sign Button/i })).toHaveTextContent("Sign");
    expect(screen.getByRole("button", { name: /Sign Button/i })).toHaveClass("btn-primary");
  });

  it("is disabled when signed", async () => {
    jest.spyOn(conversionUtils, "digestMessage").mockResolvedValueOnce("random digest");
    customRender(<Sign />);

    // fill out the form
    userEvent.type(
      screen.getByRole("textbox", { name: /Receiver PK/i }),
      new Array(initialState.user.publicKey.length).fill("A").join("")
    );
    userEvent.type(screen.getByRole("spinbutton", { name: /Sign Amount/i }), Number(320.12).toFixed(2));
    userEvent.type(screen.getByRole("textbox", { name: /Sign Message/i }), "random{space}message");

    userEvent.click(screen.getByRole("button", { name: /Sign Button/i }));

    await waitFor(() => expect(screen.getByRole("button", { name: /Sign Button/i })).toBeDisabled());
    expect(screen.getByRole("button", { name: /Sign Button/i })).toHaveTextContent("Signed");
    expect(screen.getByRole("button", { name: /Sign Button/i })).toHaveClass("btn-success");
  });
});

describe("Amount checking", () => {
  beforeEach(() => customRender(<Sign />));

  it("shows error when empty", async () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    signAmount.focus();
    signAmount.blur(); // cause an error

    const alert = await screen.findByRole("alert", { name: /Amount Feedback/i });
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Amount is required!");
  });

  it("shows error when negative", async () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    userEvent.type(signAmount, "-0.1");
    signAmount.blur(); // cause an error

    const alert = await screen.findByRole("alert", { name: /Amount Feedback/i });
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Cannot be a negative value");
  });

  it("shows error when below minimum (0.10)", async () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    userEvent.type(signAmount, "0.09");
    signAmount.blur(); // cause an error

    const alert = await screen.findByRole("alert", { name: /Amount Feedback/i });
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Must be at least $0.10 LC");
  });

  it("shows error when above maximum", async () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    userEvent.type(signAmount, (initialState.user.balance + 0.01).toString());
    signAmount.blur(); // cause an error

    const alert = await screen.findByRole("alert", { name: /Amount Feedback/i });
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(`Must be at most $${numberWithCommas(initialState.user.balance)} LC`);
  });

  it("does not show error when between", () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    userEvent.type(signAmount, "123.4");
    signAmount.blur();

    expect(screen.queryByRole("alert", { name: /Amount Feedback/i })).not.toBeInTheDocument();
  });

  it("shows error when more than 2 decimal places", async () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    userEvent.type(signAmount, "123.456");
    signAmount.blur(); // cause an error

    const alert = await screen.findByRole("alert", { name: /Amount Feedback/i });
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Allowed at most 2 decimal places");
  });

  it("does not show error for 2 decimal places", () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    userEvent.type(signAmount, "123.45");
    signAmount.blur();

    expect(screen.queryByRole("alert", { name: /Amount Feedback/i })).not.toBeInTheDocument();
  });
});

describe("form validation", () => {
  test("invalid receiver public key length - empty", async () => {
    customRender(<Sign />);

    const input = screen.getByRole("textbox", { name: /Receiver PK/i });
    input.focus();
    input.blur(); // cause an error

    const alert = await screen.findByRole("alert", { name: /Receiver PK Feedback/i });
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Receiver Public Key is required!");
  });

  test("invalid receiver public key length - short", async () => {
    customRender(<Sign />);

    const input = screen.getByRole("textbox", { name: /Receiver PK/i });
    const text = new Array(initialState.user.publicKey.length - 1).fill("A").join("");
    userEvent.type(input, text);
    input.blur(); // cause an error
    expect(input).toHaveValue(text);

    const alert = await screen.findByRole("alert", { name: /Receiver PK Feedback/i });
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Length is too short");
  });

  test("invalid receiver public key length - long", async () => {
    customRender(<Sign />);

    const input = screen.getByRole("textbox", { name: /Receiver PK/i });
    const text = new Array(initialState.user.publicKey.length + 1).fill("A").join("");
    userEvent.type(input, text);
    input.blur(); // cause an error

    expect(input).toHaveValue(text);

    const alert = await screen.findByRole("alert", { name: /Receiver PK Feedback/i });
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Length is too long");
  });

  test("invalid receiver public key length - alphanumeric", async () => {
    customRender(<Sign />);

    const input = screen.getByRole("textbox", { name: /Receiver PK/i });
    const text = new Array(initialState.user.publicKey.length - 1).fill("A").join("");
    userEvent.type(input, text + "@");
    input.blur(); // cause an error

    expect(input).toHaveValue(text + "@");

    const alert = await screen.findByRole("alert", { name: /Receiver PK Feedback/i });
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Format is invalid, characters must be alphanumeric");
  });

  test("valid receiver public key length", async () => {
    customRender(<Sign />);

    const input = screen.getByRole("textbox", { name: /Receiver PK/i });
    const text = new Array(initialState.user.publicKey.length).fill("A").join("");
    userEvent.type(input, text);
    input.blur(); // cause an error

    expect(input).toHaveValue(text);

    expect(screen.queryByRole("alert", { name: /Receiver PK Feedback/i })).not.toBeInTheDocument();
  });
});
