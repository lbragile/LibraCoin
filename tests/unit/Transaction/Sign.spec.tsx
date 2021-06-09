/**
 * @group unit
 */

import React, { useReducer } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Sign from "../../../src/components/Transaction/Sign";
import { AppContext } from "../../../src/context/AppContext";
import { AppReducer } from "../../../src/reducers/AppReducer";
import { IAction, IState } from "../../../src/typings/AppTypes";

const { initialState } = global;

interface ISendWrapper {
  validated: boolean;
  signed: boolean;
  handleSubmit?: () => void;
  stateMock?: IState;
  dispatchMock?: React.Dispatch<IAction>;
}

const SignWrapper = ({ validated, signed, handleSubmit, stateMock, dispatchMock }: ISendWrapper) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state: stateMock ?? state, dispatch: dispatchMock ?? dispatch }}>
      <Sign validated={validated} signed={signed} handleSubmit={handleSubmit ?? jest.fn()} />
    </AppContext.Provider>
  );
};

it("renders correctly", () => {
  const { asFragment } = render(<SignWrapper validated={false} signed={false} />);

  expect(screen.getByRole("form", { name: /Sign Form/i })).toHaveFormValues({
    "sender-pk": initialState.user.publicKey,
    "receiver-pk": "",
    amount: null,
    msg: "",
    "sender-sk": initialState.user.privateKey
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
    render(<SignWrapper validated={false} signed={false} />);

    expect(screen.getByRole("button", { name: /Sign Button/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Sign Button/i })).toHaveTextContent("Sign");
  });

  it("is disabled when signed", () => {
    render(<SignWrapper validated={false} signed={true} />);

    expect(screen.getByRole("button", { name: /Sign Button/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Sign Button/i })).toHaveTextContent("Sign");
  });
});

describe("Amount checking", () => {
  beforeEach(() => {
    render(<SignWrapper validated={false} signed={false} />);
  });

  it("clamps when below minimum (0.10)", () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    signAmount.focus();
    fireEvent.change(signAmount, { target: { value: "0.01" } });
    signAmount.blur();

    expect(signAmount).toHaveValue(0.1);
  });

  it("clamps when above maximum (1000.00)", () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    signAmount.focus();
    fireEvent.change(signAmount, { target: { value: "1000.01" } });
    signAmount.blur();

    expect(signAmount).toHaveValue(1000.0);
  });

  it("does not clamp when value is between min and max", () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    signAmount.focus();
    fireEvent.change(signAmount, { target: { value: "123.45" } });
    signAmount.blur();

    expect(signAmount).toHaveValue(123.45);
  });

  it("maintains 2 decimal places", () => {
    const signAmount = screen.getByRole("spinbutton", { name: /Sign Amount/i });
    signAmount.focus();
    fireEvent.change(signAmount, { target: { value: "123.456" } });
    signAmount.blur();

    expect(signAmount).toHaveValue(123.46);
  });
});

it("submits form when send button is pressed", () => {
  const handleSubmit = jest.fn().mockImplementation((e) => e.preventDefault());

  render(<SignWrapper validated={false} signed={false} handleSubmit={handleSubmit} />);

  fireEvent.click(screen.getByRole("button"));

  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
