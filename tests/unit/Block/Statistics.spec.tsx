import React, { useReducer } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Statistics from "../../../src/components/Block/Statistics";
import { AppContext } from "../../../src/context/AppContext";
import { IAction, IState } from "../../../src/typings/AppTypes";
import { ACTIONS } from "../../../src/enums/AppDispatchActions";
import * as ConversionUtil from "../../../src/utils/conversion";
import { AppReducer } from "../../../src/reducers/AppReducer";

const { initialState } = global;

interface IStatisticsWrapper {
  chain: boolean;
  stateMock?: IState;
  dispatchMock?: React.Dispatch<IAction>;
}

const StatisticsWrapper = ({ chain, stateMock, dispatchMock }: IStatisticsWrapper) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state: stateMock ?? state, dispatch: dispatchMock ?? dispatch }}>
      <Statistics chain={chain} />
    </AppContext.Provider>
  );
};

describe("in preview mode", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<StatisticsWrapper chain={false} />);

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
        const ogState: IState = JSON.parse(JSON.stringify(initialState));
        ogState.selectedTrans = [];

        render(<StatisticsWrapper chain={false} stateMock={ogState} />);

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled();
      });

      test("that mine button is enabled when there are a few selected transactions", () => {
        render(<StatisticsWrapper chain={false} />);

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();
      });
    });

    describe("button behavior during mining (disabled the button while mining)", () => {
      beforeEach(() => {
        jest.spyOn(ConversionUtil, "randomHash").mockReturnValueOnce("random");
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

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

        render(<StatisticsWrapper chain={false} dispatchMock={dispatchMock} />);

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();
        fireEvent.click(screen.getByRole("button", { name: /Block Mine/i })); // mining is async so setting mine button to disabled happens outside React's call stack
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

        render(<StatisticsWrapper chain={false} />);

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();

        // mining is async so setting mine button to disabled happens outside React's call stack
        fireEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());

        // solution is invalid, so it will re-enable
        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled());
        expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");
      });

      it("keeps mining button disabled after mining due to valid solution", async () => {
        const solution = "000a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
        const target = "000b4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";

        jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce(target).mockResolvedValueOnce(solution);

        render(<StatisticsWrapper chain={false} />);

        expect(screen.getByRole("button", { name: /Block Mine/i })).toBeEnabled();

        fireEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

        // need to await state changes
        await waitFor(() => expect(screen.getByRole("button", { name: /Block Mine/i })).toBeDisabled());
        expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("valid-solution");
      });
    });
  });
});
