import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { AppContext } from "../../../src/context/AppContext";
import Block from "../../../src/components/Block/Block";
import { IState } from "../../../src/typings/AppTypes";

const { state, dispatch } = global;

describe("in preview mode", () => {
  it("renders correctly", () => {
    Date.now = jest.fn().mockReturnValueOnce(45678);

    const { asFragment } = render(
      <AppContext.Provider value={{ state, dispatch }}>
        <Block chain={false} merkleRoot={"abc"} index={0} />
      </AppContext.Provider>
    );

    expect(screen.getByRole("form", { name: /Block Form/i })).toHaveFormValues({
      index: state.preview.index,
      timestamp: 45678,
      prevHash: state.preview.prevHash,
      currHash: state.preview.currHash,
      merkle: "abc"
    });

    const index = screen.getByRole("spinbutton", { name: /Block Index/i });
    expect(index).toBeDisabled();
    expect(index).not.toBeRequired();

    const timestamp = screen.getByRole("spinbutton", { name: /Block Timestamp/i });
    expect(timestamp).toBeDisabled();
    expect(timestamp).not.toBeRequired();

    const prevHash = screen.getByRole("textbox", { name: /Block PrevHash/i });
    expect(prevHash).toHaveAttribute("readOnly");
    expect(prevHash).not.toBeRequired();

    const currHash = screen.getByRole("textbox", { name: /Block CurrHash/i });
    expect(currHash).toHaveAttribute("readOnly");
    expect(currHash).not.toBeRequired();

    const merkle = screen.getByRole("textbox", { name: /Block Merkle/i });
    expect(merkle).toHaveAttribute("readOnly");
    expect(merkle).not.toBeRequired();

    expect(screen.queryByLabelText(/Show Trans/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it("Shows 'Add Block' button when valid", () => {
    const ogState = JSON.parse(JSON.stringify(state)) as IState;
    ogState.preview.valid = true;

    const { asFragment } = render(
      <AppContext.Provider value={{ state: ogState, dispatch }}>
        <Block chain={false} merkleRoot={"abc"} index={0} />
      </AppContext.Provider>
    );

    expect(screen.getByRole("button", { name: /Add Block/i })).toHaveTextContent("Add Block");

    expect(asFragment()).toMatchSnapshot();
  });
});
