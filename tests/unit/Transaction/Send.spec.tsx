/**
 * @group unit
 */

import React, { useReducer } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Send from "../../../src/components/Transaction/Send";
import { AppContext } from "../../../src/context/AppContext";
import { IAction, IState } from "../../../src/typings/AppTypes";
import { AppReducer } from "../../../src/reducers/AppReducer";

const { initialState } = global;

const SendWrapper = ({ stateMock, dispatchMock }: { stateMock?: IState; dispatchMock?: React.Dispatch<IAction> }) => {
  const [state, dispatch] = useReducer(AppReducer, stateMock ?? initialState);

  return (
    <AppContext.Provider value={{ state, dispatch: dispatchMock ?? dispatch }}>
      <Send />
    </AppContext.Provider>
  );
};

it("renders correctly", () => {
  const { asFragment } = render(<SendWrapper />);

  expect(screen.getByRole("form", { name: /Send Form/i })).toHaveFormValues({
    "receiver-pk": "",
    amount: 0,
    msg: "",
    sig: ""
  });

  const receiverPublicKey = screen.getByRole("textbox", { name: /Receiver Public Key/i });
  expect(receiverPublicKey).toHaveAttribute("readOnly");
  expect(receiverPublicKey).not.toBeRequired();

  expect(screen.getByText(/Make sure this matches/i)).toBeInTheDocument();

  const sendAmount = screen.getByRole("spinbutton", { name: /Send Amount/i });
  expect(sendAmount).toHaveAttribute("readOnly");
  expect(sendAmount).not.toHaveAttribute("placeholder");
  expect(sendAmount).not.toBeRequired();

  const sendMessage = screen.getByRole("textbox", { name: /Send Message/i });
  expect(sendMessage).toHaveAttribute("readOnly");
  expect(sendMessage).toHaveAttribute("placeholder", "optional message...");
  expect(sendMessage).not.toBeRequired();

  const signature = screen.getByRole("textbox", { name: /Transaction Signature/i });
  expect(signature).toHaveAttribute("readOnly");
  expect(signature).not.toBeRequired();

  expect(screen.getByText(/Receiver uses this along/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Send Button/i })).toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});

describe("send button state", () => {
  it("is disabled when not signed", () => {
    render(<SendWrapper />);

    expect(screen.getByRole("button", { name: /Send Button/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Send Button/i })).toHaveTextContent("Send");
    expect(screen.getByRole("button", { name: /Send Button/i })).toHaveClass("btn-primary");
  });

  it("is enabled when signed", () => {
    render(<SendWrapper stateMock={{ ...initialState, wallet: { ...initialState.wallet, signed: true } }} />);

    expect(screen.getByRole("button", { name: /Send Button/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Send Button/i })).toHaveTextContent("Send");
    expect(screen.getByRole("button", { name: /Send Button/i })).toHaveClass("btn-primary");
  });

  it("is disabled when sent", () => {
    render(<SendWrapper stateMock={{ ...initialState, wallet: { ...initialState.wallet, signed: true } }} />);

    fireEvent.click(screen.getByRole("button", { name: /Send Button/i }));

    expect(screen.getByRole("button", { name: /Send Button/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Send Button/i })).toHaveTextContent("Sent");
    expect(screen.getByRole("button", { name: /Send Button/i })).toHaveClass("btn-success");
  });
});
