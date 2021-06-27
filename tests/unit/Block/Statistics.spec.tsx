/**
 * @group unit
 */

import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Statistics from "../../../src/components/Block/Statistics";
import { customRender } from "../../utils/testUtils";
import * as ConversionUtil from "../../../src/utils/conversion";
import { ACTIONS } from "../../../src/enums/AppDispatchActions";

const { initialState } = global;

describe("in preview mode", () => {
  it("renders correctly", () => {
    const { asFragment } = customRender(<Statistics chain={false} index={initialState.preview.index} />);

    expect(screen.getByRole("form", { name: /Block Statistics/i })).toHaveFormValues({
      nonce: 0,
      header: 0,
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
    expect(solution).toHaveClass("invalid-solution");

    const mineBtn = screen.getByRole("button", { name: /Block Mine/i });
    expect(mineBtn).toHaveTextContent("Mine");
    expect(mineBtn).toBeEnabled();

    expect(asFragment()).toMatchSnapshot();
  });

  describe("mining process", () => {
    describe("selected transactions", () => {
      test("that mine button is disabled when there are no selected transactions", () => {
        customRender(<Statistics chain={false} index={initialState.preview.index} />, {
          stateMock: { ...initialState, selectedTrans: [] }
        });

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled();
      });

      test("that mine button is enabled when there are a few selected transactions", () => {
        customRender(<Statistics chain={false} index={initialState.preview.index} />);

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();
      });
    });

    describe("button behavior during mining (disabled the button while mining)", () => {
      beforeEach(() => jest.spyOn(ConversionUtil, "randomHash").mockReturnValueOnce("random"));

      it("calls dispatch & updates solution/target fields correctly", async () => {
        const badSolution = "032a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
        const solution = "000a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
        const target = "000z4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";

        const dispatchMock = jest.fn();
        Date.now = jest.fn().mockReturnValueOnce(12345);
        jest
          .spyOn(ConversionUtil, "digestMessage")
          .mockResolvedValueOnce(target)
          .mockResolvedValueOnce(badSolution)
          .mockResolvedValueOnce(solution);

        customRender(<Statistics chain={false} index={initialState.preview.index} />, { dispatchMock });

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();
        userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));
        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());

        expect(screen.getByRole("textbox", { name: /Block Target/i })).toHaveValue(target);
        expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveValue(solution);

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: ACTIONS.UPDATE_PREVIEW,
          payload: {
            preview: {
              ...initialState.preview,
              timestamp: 12345,
              prevHash: initialState.chain[initialState.preview.index - 1].currHash,
              currHash: solution,
              valid: true
            }
          }
        });
      });

      it("enables mining button after mining due to invalid solution", async () => {
        const solution = "000a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
        const target = "00034fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";

        jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce(target).mockResolvedValueOnce(solution);

        customRender(<Statistics chain={false} index={initialState.preview.index} />);

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();

        // mining is async so setting mine button to disabled happens outside React's call stack
        userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());

        // solution is invalid, so it will re-enable
        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled());
        expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");
      });

      it("keeps mining button disabled after mining due to valid solution", async () => {
        const solution = "000a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
        const target = "000b4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";

        jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce(target).mockResolvedValueOnce(solution);

        customRender(<Statistics chain={false} index={initialState.preview.index} />);

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();

        userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

        // need to await state changes
        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());
        expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("valid-solution");
      });
    });
  });
});

describe("in blockchain mode", () => {
  describe("renders correctly", () => {
    test.each`
      desc         | index | solutionClass         | isDisabled
      ${"valid"}   | ${0}  | ${"valid-solution"}   | ${true}
      ${"invalid"} | ${2}  | ${"invalid-solution"} | ${false}
    `("block is $desc (index: $index)", ({ index, solutionClass, isDisabled }) => {
      const { asFragment } = customRender(<Statistics chain={true} index={index} />);

      expect(screen.getByRole("form", { name: /Block Statistics/i })).toHaveFormValues({
        nonce: 0,
        header: 0,
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
      expect(solution).toHaveClass(solutionClass);

      const mineBtn = screen.getByRole("button", { name: /Block Mine/i });
      expect(mineBtn).toHaveTextContent("Mine");
      // eslint-disable-next-line jest/no-conditional-expect
      isDisabled ? expect(mineBtn).toBeDisabled() : expect(mineBtn).toBeEnabled();

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("mining process", () => {
    describe("button behavior during mining (disabled the button while mining)", () => {
      beforeEach(() => jest.spyOn(ConversionUtil, "randomHash").mockReturnValueOnce("random"));
      afterEach(() => jest.restoreAllMocks());

      it("calls dispatch & updates solution/target fields correctly (last block)", async () => {
        const badSolution = "032a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
        const solution = "000a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
        const target = "000z4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
        const index = 2; // an invalid block initially

        const dispatchMock = jest.fn();
        Date.now = jest.fn().mockReturnValueOnce(12345);
        jest
          .spyOn(ConversionUtil, "digestMessage")
          .mockResolvedValueOnce(target)
          .mockResolvedValueOnce(badSolution)
          .mockResolvedValueOnce(solution);

        customRender(<Statistics chain={true} index={index} />, { dispatchMock });

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();
        userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));
        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());

        expect(screen.getByRole("textbox", { name: /Block Target/i })).toHaveValue(target);
        expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveValue(solution);

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: ACTIONS.UPDATE_BLOCK,
          payload: {
            block: {
              ...initialState.chain[index],
              timestamp: 12345,
              prevHash: initialState.chain[index - 1].currHash,
              currHash: solution,
              valid: true
            }
          }
        });
      });

      it("enables mining button after mining due to invalid solution", async () => {
        const solution = "000a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
        const target = "00034fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";

        jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce(target).mockResolvedValueOnce(solution);

        customRender(<Statistics chain={true} index={2} />);

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();

        // mining is async so setting mine button to disabled happens outside React's call stack
        userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());

        // solution is invalid, so it will re-enable
        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled());
        expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");
      });

      it("keeps mining button disabled after mining due to valid solution", async () => {
        const solution = "000a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
        const target = "000b4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";

        jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce(target).mockResolvedValueOnce(solution);

        customRender(<Statistics chain={false} index={2} />);

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();

        userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

        // need to await state changes
        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());
        expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("valid-solution");
      });
    });
  });

  describe("propagation after mining", () => {
    beforeEach(() => jest.spyOn(ConversionUtil, "randomHash").mockReturnValueOnce("random"));

    it("only updates current block if last", async () => {
      const solution = "000a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
      const target = "000z4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
      const index = initialState.chain.length - 1; // last block

      // need to make it invalid first, to be able to mine it
      const chain = [...initialState.chain];
      if (initialState.chain[index].valid) {
        chain[index].valid = false;
      }

      const dispatchMock = jest.fn();
      Date.now = jest.fn().mockReturnValueOnce(12345);
      jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce(target).mockResolvedValueOnce(solution);

      customRender(<Statistics chain={true} index={index} />, { stateMock: { ...initialState, chain }, dispatchMock });

      expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();
      userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));
      await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());

      expect(dispatchMock).toHaveBeenCalledTimes(1); // first call is the block itself
    });

    it("propagates if not last", async () => {
      const solution = "000a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
      const target = "000z4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
      const index = initialState.chain.length - 2; // second to last block

      // need to make it invalid first, to be able to mine it
      const chain = [...initialState.chain];
      if (initialState.chain[index].valid) {
        chain[index].valid = false;
      }

      const dispatchMock = jest.fn();
      Date.now = jest.fn().mockReturnValueOnce(12345);
      jest
        .spyOn(ConversionUtil, "digestMessage")
        .mockResolvedValue("random")
        .mockResolvedValueOnce(target)
        .mockResolvedValueOnce(solution);

      customRender(<Statistics chain={true} index={index} />, { stateMock: { ...initialState, chain }, dispatchMock });

      expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();
      userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));
      await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());

      expect(dispatchMock).toHaveBeenCalledTimes(2);
    });
  });
});
