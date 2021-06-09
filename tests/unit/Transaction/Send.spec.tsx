/**
 * @group unit
 */

import React, { useReducer } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Send from "../../../src/components/Transaction/Send";
import { AppContext } from "../../../src/context/AppContext";
import { IAction, IState, ITransaction } from "../../../src/typings/AppTypes";
import { AppReducer } from "../../../src/reducers/AppReducer";

const { initialState } = global;

interface ISendWrapper {
  validated: boolean;
  signed: boolean;
  details: ITransaction;
  handleSubmit?: jest.Mock<() => void>;
  stateMock?: IState;
  dispatchMock?: React.Dispatch<IAction>;
}

const SendWrapper = ({ validated, signed, details, handleSubmit, stateMock, dispatchMock }: ISendWrapper) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state: stateMock ?? state, dispatch: dispatchMock ?? dispatch }}>
      <Send
        validated={validated}
        signed={signed}
        details={details}
        handleSubmit={handleSubmit ?? jest.fn()}
        setValidated={jest.fn()}
        setSigned={jest.fn()}
      />
    </AppContext.Provider>
  );
};

const formDetails: ITransaction = {
  to: "",
  from: initialState.user.publicKey ?? "",
  amount: undefined,
  message: "",
  signature: ""
};

it("renders correctly", () => {
  const { asFragment } = render(<SendWrapper validated={false} signed={false} details={formDetails} />);

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
    render(<SendWrapper validated={false} signed={true} details={formDetails} />);

    expect(screen.getByRole("button")).toBeEnabled();
    expect(screen.getByRole("button")).toHaveTextContent("Send");
  });

  it("is disabled when not signed", () => {
    render(<SendWrapper validated={false} signed={false} details={formDetails} />);

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent("Send");
  });
});

it("submits form when send button is pressed", () => {
  const handleSubmit = jest.fn().mockImplementation((e) => e.preventDefault());

  render(<SendWrapper validated={false} signed={true} details={formDetails} handleSubmit={handleSubmit} />);

  fireEvent.click(screen.getByRole("button"));

  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
