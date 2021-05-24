import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Send from "../../../src/components/Transaction/Send";
import { AppContext } from "../../../src/context/AppContext";
import { ITransaction } from "../../../src/typings/AppTypes";

const { state, dispatch } = global;

const formDetails: ITransaction = {
  to: "",
  from: state.user.publicKey ?? "",
  amount: undefined,
  message: "",
  signature: ""
};

it("renders correctly", () => {
  const { asFragment } = render(
    <AppContext.Provider value={{ state, dispatch }}>
      <Send
        validated={false}
        signed={false}
        handleSubmit={jest.fn()}
        details={formDetails}
        setValidated={jest.fn()}
        setSigned={jest.fn()}
      />
    </AppContext.Provider>
  );

  expect(screen.getByRole("form", { name: /Send Form/i })).toHaveFormValues({
    "receiver-pk": "",
    amount: null,
    msg: "",
    sig: ""
  });

  const receiverPublicKey = screen.getByRole("textbox", { name: /Receiver Public Key/i });
  expect(receiverPublicKey).toHaveAttribute("readOnly");
  expect(receiverPublicKey).not.toBeRequired();

  expect(screen.getByText(/Make sure this matches/i)).toBeInTheDocument();

  const sendAmount = screen.getByRole("spinbutton", { name: /Send Amount/i });
  expect(sendAmount).toBeDisabled();
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

  expect(asFragment()).toMatchSnapshot();
});

describe("send button state", () => {
  it("is enabled when signed", () => {
    render(
      <AppContext.Provider value={{ state, dispatch }}>
        <Send
          validated={false}
          signed={true}
          handleSubmit={jest.fn()}
          details={formDetails}
          setValidated={jest.fn()}
          setSigned={jest.fn()}
        />
      </AppContext.Provider>
    );

    expect(screen.getByRole("button")).toBeEnabled();
    expect(screen.getByRole("button")).toHaveTextContent("Send");
  });

  it("is disabled when not signed", () => {
    render(
      <AppContext.Provider value={{ state, dispatch }}>
        <Send
          validated={false}
          signed={false}
          handleSubmit={jest.fn()}
          details={formDetails}
          setValidated={jest.fn()}
          setSigned={jest.fn()}
        />
      </AppContext.Provider>
    );

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent("Send");
  });
});

it("submits form when send button is pressed", () => {
  const handleSubmit = jest.fn().mockImplementation((e) => e.preventDefault());

  render(
    <AppContext.Provider value={{ state, dispatch }}>
      <Send
        validated={false}
        signed={true}
        handleSubmit={handleSubmit}
        details={formDetails}
        setValidated={jest.fn()}
        setSigned={jest.fn()}
      />
    </AppContext.Provider>
  );

  fireEvent.click(screen.getByRole("button"));

  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
