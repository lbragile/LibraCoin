/**
 * @group unit
 */

import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Sign from "../../../src/components/Transaction/Sign";
import * as conversionUtils from "../../../src/utils/conversion";
import { customRender } from "../../utils/testUtils";

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

  const receiverPublicKey = screen.getByRole("textbox", { name: /Receiver Public Key/i });
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
      screen.getByRole("textbox", { name: /Receiver Public Key/i }),
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
      screen.getByRole("textbox", { name: /Receiver Public Key/i }),
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

describe.skip("Amount checking", () => {
  beforeEach(() => customRender(<Sign />));

  it("clamps when below minimum (0.10)", () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    signAmount.focus();
    userEvent.type(signAmount, "0.01");
    signAmount.blur();

    expect(signAmount).toHaveValue(0.1);
  });

  it("clamps when above maximum (1000.00)", () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    signAmount.focus();
    userEvent.type(signAmount, "1000.01");
    signAmount.blur();

    expect(signAmount).toHaveValue(1000.0);
  });

  it("does not clamp when value is between min and max", () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    signAmount.focus();
    userEvent.type(signAmount, "123.45");
    signAmount.blur();

    expect(signAmount).toHaveValue(123.45);
  });

  it("maintains 2 decimal places", () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    signAmount.focus();
    userEvent.type(signAmount, "123.456");
    signAmount.blur();

    expect(signAmount).toHaveValue(123.46);
  });
});

describe("form validation", () => {
  test("invalid receiver public key length - empty", async () => {
    customRender(<Sign />);

    const input = screen.getByRole("textbox", { name: /Receiver Public Key/i });
    input.focus();
    input.blur(); // cause an error

    const alert = await screen.findByRole("alert", { name: /Receiver PK Feedback/i });
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Receiver Public Key is required!");
  });

  test("invalid receiver public key length - short", async () => {
    customRender(<Sign />);

    const input = screen.getByRole("textbox", { name: /Receiver Public Key/i });
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

    const input = screen.getByRole("textbox", { name: /Receiver Public Key/i });
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

    const input = screen.getByRole("textbox", { name: /Receiver Public Key/i });
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

    const input = screen.getByRole("textbox", { name: /Receiver Public Key/i });
    const text = new Array(initialState.user.publicKey.length).fill("A").join("");
    userEvent.type(input, text);
    input.blur(); // cause an error

    expect(input).toHaveValue(text);

    expect(screen.queryByRole("alert", { name: /Receiver PK Feedback/i })).not.toBeInTheDocument();
  });
});
