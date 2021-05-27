import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Statistics from "../../../src/components/Block/Statistics";
import { AppContext } from "../../../src/context/AppContext";
import * as MineUtil from "../../../src/utils/mine";
import * as PropagateUtil from "../../../src/utils/propagate";

const { state, dispatch } = global;

describe("in preview mode", () => {
  it("renders correctly", () => {
    const { asFragment } = render(
      <AppContext.Provider value={{ state, dispatch }}>
        <Statistics chain={false} isValid={false} solution={""} setSolution={jest.fn()} setIsValid={jest.fn()} />
      </AppContext.Provider>
    );

    expect(screen.getByRole("form", { name: /Block Statistics/i })).toHaveFormValues({
      nonce: null,
      header: null,
      target: "",
      solution: ""
    });

    const nonce = screen.getByRole("spinbutton", { name: /Block Nonce/i });
    expect(nonce).toBeDisabled();
    expect(nonce).not.toBeRequired();

    const header = screen.getByRole("spinbutton", { name: /Block Header/i });
    expect(header).toBeDisabled();
    expect(header).not.toBeRequired();

    const target = screen.getByRole("textbox", { name: /Block Target/i });
    expect(target).toHaveAttribute("readOnly");
    expect(target).not.toBeRequired();

    const solution = screen.getByRole("textbox", { name: /Block Solution/i });
    expect(solution).toHaveAttribute("readOnly");
    expect(solution).not.toBeRequired();
    expect(solution).toHaveStyle({ color: "red" });

    const mineBtn = screen.getByRole("button", { name: /Block Mine/i });
    expect(mineBtn).toHaveTextContent("Mine");
    expect(mineBtn).toBeEnabled();

    expect(asFragment()).toMatchSnapshot();
  });

  describe("mining process", () => {
    describe("selected transactions", () => {
      test("that mine button is disabled when there are no selected transactions", () => {
        const ogState = JSON.parse(JSON.stringify(state));
        ogState.selectedTrans = [];

        render(
          <AppContext.Provider value={{ state: ogState, dispatch }}>
            <Statistics chain={false} isValid={false} solution={""} setSolution={jest.fn()} setIsValid={jest.fn()} />
          </AppContext.Provider>
        );

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled();
      });

      test("that mine button is enabled when there are a few selected transactions", () => {
        render(
          <AppContext.Provider value={{ state, dispatch }}>
            <Statistics chain={false} isValid={false} solution={""} setSolution={jest.fn()} setIsValid={jest.fn()} />
          </AppContext.Provider>
        );

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();
      });
    });

    describe("button behavior during mining", () => {
      it("disables the button while mining, but enables after since not valid", async () => {
        const solution = "000111222333";

        render(
          <AppContext.Provider value={{ state, dispatch }}>
            <Statistics
              chain={false}
              isValid={false}
              solution={solution}
              setSolution={jest.fn()}
              setIsValid={jest.fn()}
            />
          </AppContext.Provider>
        );

        Math.random = jest.fn().mockReturnValueOnce(0.5);
        const mineSpy = jest.spyOn(MineUtil, "mine").mockReturnValueOnce(new Promise((resolve) => resolve(solution)));

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();
        fireEvent.click(screen.getByRole("button", { name: /Block Mine/i })); // mining is async so setting mine button to disabled happens outside React's call stack
        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());

        // becomes enabled again since not valid
        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled());

        expect(screen.getByRole("form", { name: /Block Statistics/i })).toHaveFormValues({
          nonce: 0.5 * 1e6,
          header: null,
          target: "",
          solution
        });

        const anyFunc = expect.any(Function);
        expect(mineSpy).toHaveBeenCalledTimes(1);
        expect(mineSpy).toHaveBeenCalledWith(0.5 * 1e6, anyFunc, anyFunc, anyFunc, anyFunc);

        expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveValue(solution);
        expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveStyle({ color: "red" });
      });

      it("disables the button while mining, and remains disabled after since valid", async () => {
        const solution = "000111222333";

        const { rerender } = render(
          <AppContext.Provider value={{ state, dispatch }}>
            <Statistics
              chain={false}
              isValid={false}
              solution={solution}
              setSolution={jest.fn()}
              setIsValid={jest.fn()}
            />
          </AppContext.Provider>
        );

        Math.random = jest.fn().mockReturnValueOnce(0.5);
        const mineSpy = jest.spyOn(MineUtil, "mine").mockReturnValueOnce(new Promise((resolve) => resolve(solution)));

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();
        fireEvent.click(screen.getByRole("button", { name: /Block Mine/i })); // mining is async so setting mine button to disabled happens outside React's call stack
        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());

        rerender(
          <AppContext.Provider value={{ state, dispatch }}>
            <Statistics
              chain={false}
              isValid={true}
              solution={solution}
              setSolution={jest.fn()}
              setIsValid={jest.fn()}
            />
          </AppContext.Provider>
        );

        // here it does not become valid after mining unlike the previous test

        expect(screen.getByRole("form", { name: /Block Statistics/i })).toHaveFormValues({
          nonce: 0.5 * 1e6,
          header: null,
          target: "",
          solution
        });

        const anyFunc = expect.any(Function);
        expect(mineSpy).toHaveBeenCalledTimes(1);
        expect(mineSpy).toHaveBeenCalledWith(0.5 * 1e6, anyFunc, anyFunc, anyFunc, anyFunc);

        expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveValue(solution);
        expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveStyle({ color: "green" });
      });
    });
  });
});

describe("on the blockchain", () => {
  it("renders properly", () => {
    const { asFragment } = render(
      <AppContext.Provider value={{ state, dispatch }}>
        <Statistics chain={true} isValid={false} solution={""} setSolution={jest.fn()} setIsValid={jest.fn()} />
      </AppContext.Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("propagates the block status after mining regardless of if valid", async () => {
    const solution = "000111222333";
    const blockMock = state.chain[1];

    render(
      <AppContext.Provider value={{ state, dispatch }}>
        <Statistics
          chain={true}
          isValid={false}
          solution={solution}
          setSolution={jest.fn()}
          setIsValid={jest.fn()}
          block={blockMock}
        />
      </AppContext.Provider>
    );

    Math.random = jest.fn().mockReturnValueOnce(0.5);
    const mineSpy = jest.spyOn(MineUtil, "mine").mockReturnValueOnce(new Promise((resolve) => resolve(solution)));
    const propagateSpy = jest.spyOn(PropagateUtil, "propagateBlockStatus").mockResolvedValue(undefined);

    fireEvent.click(screen.getByRole("button", { name: /Block Mine/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());

    const anyFunc = expect.any(Function);
    expect(mineSpy).toHaveBeenCalledTimes(1);
    expect(mineSpy).toHaveBeenCalledWith(0.5 * 1e6, anyFunc, anyFunc, anyFunc, anyFunc);

    expect(propagateSpy).toHaveBeenCalledTimes(1);
    expect(propagateSpy).toHaveBeenCalledWith(state, dispatch, blockMock.index, blockMock.prevHash, solution, true);
  });
});
