import React, { useReducer } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { AppContext } from "../../src/context/AppContext";
import Block from "../../src/components/Block/Block";
import Statistics from "../../src/components/Block/Statistics";
import { IAction, IState } from "../../src/typings/AppTypes";
import { AppReducer } from "../../src/reducers/AppReducer";
import * as ConversionUtil from "../../src/utils/conversion";

const { initialState } = global;

interface IBlockStatisticsWrapper {
  chain: boolean;
  index: number;
  stateMock?: IState;
  dispatchMock?: React.Dispatch<IAction>;
}

// need to access the state in tests
let state: IState, dispatch: React.Dispatch<IAction>;

const BlockStatisticsWrapper = ({ chain, index, stateMock, dispatchMock }: IBlockStatisticsWrapper) => {
  [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state: stateMock ?? state, dispatch: dispatchMock ?? dispatch }}>
      <div className="container-fluid row d-flex justify-content-center mx-auto my-3">
        <Statistics chain={chain} index={index} />
        <Block chain={chain} index={index} />
      </div>
    </AppContext.Provider>
  );
};

describe("in preview mode", () => {
  it("starts off invalid, but after mining turns valid", async () => {
    const solution = "000a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
    const target = "000z4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";

    Date.now = jest.fn().mockReturnValueOnce(12345).mockReturnValueOnce(67890); // first time right after mining, second time in addition of block
    jest.spyOn(ConversionUtil, "randomHash").mockReturnValue("random");
    jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce(target).mockResolvedValueOnce(solution);

    const { asFragment } = render(<BlockStatisticsWrapper chain={false} index={initialState.preview.timestamp} />);

    expect(screen.getByRole("form", { name: /Block Statistics/i })).toHaveFormValues({
      nonce: 0,
      header: 0,
      target: "",
      solution: ""
    });

    expect(screen.getByRole("form", { name: /Block Form/i })).toHaveFormValues({
      ...initialState.preview,
      valid: undefined,
      transactions: undefined
    });

    expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();
    expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("invalid-block");
    expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");

    expect(asFragment()).toMatchSnapshot();

    fireEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

    // once mining is complete
    await waitFor(() => expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("valid-block"));
    expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("valid-solution");
    expect(screen.getByRole("button", { name: /Add Block/i })).toBeInTheDocument();
    expect(state.selectedTrans).toHaveLength(1);
    expect(state.verifiedTrans).toHaveLength(5);
    expect(state.chain).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: /Add Block/i }));

    // once block is added to blockchain
    await waitFor(() => expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("invalid-block"));
    expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");
    expect(state.selectedTrans).toHaveLength(0);
    expect(state.verifiedTrans).toHaveLength(4);
    expect(state.chain).toHaveLength(3);

    await waitFor(() =>
      expect(screen.getByRole("form", { name: /Block Form/i })).toHaveFormValues({
        index: state.preview.index,
        timestamp: 67890,
        prevHash: solution,
        currHash: "",
        merkleRoot: ""
      })
    );
  });
});
