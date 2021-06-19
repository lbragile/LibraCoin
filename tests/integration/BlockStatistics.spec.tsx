/**
 * @group integration
 */

import React, { useReducer } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppContext } from "../../src/context/AppContext";
import Block from "../../src/components/Block/Block";
import Statistics from "../../src/components/Block/Statistics";
import { IAction, IState } from "../../src/typings/AppTypes";
import { AppReducer } from "../../src/reducers/AppReducer";
import * as ConversionUtil from "../../src/utils/conversion";
import { ACTIONS } from "../../src/enums/AppDispatchActions";

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
  [state, dispatch] = useReducer(AppReducer, stateMock ?? initialState);

  return (
    <AppContext.Provider value={{ state, dispatch: dispatchMock ?? dispatch }}>
      <div className="block mx-2 flex-column flex-shrink-0">
        <Block chain={chain} index={index} />
        <Statistics chain={chain} index={index} />
      </div>
    </AppContext.Provider>
  );
};

describe("in preview mode", () => {
  it("starts off invalid, and after mining it stays invalid (cannot be added to blockchain)", async () => {
    const solution = "000z4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
    const target = "000y4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";

    Date.now = jest.fn().mockReturnValueOnce(12345);
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

    userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

    // once mining is complete
    await waitFor(() => expect(screen.getByRole("status")).toHaveClass("invisible"));
    expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("invalid-block");
    expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");
    expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();
    expect(state.selectedTrans).toHaveLength(initialState.selectedTrans.length);
    expect(state.verifiedTrans).toHaveLength(initialState.verifiedTrans.length);
    expect(state.chain).toHaveLength(initialState.chain.length);
  });

  it("starts off invalid, but after mining turns valid, and is added to blockchain", async () => {
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

    userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

    // once mining is complete
    await waitFor(() => expect(screen.getByRole("status")).toHaveClass("invisible"));
    expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("valid-block");
    expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("valid-solution");
    expect(screen.getByRole("button", { name: /Add Block/i })).toBeInTheDocument();
    expect(state.selectedTrans).toHaveLength(initialState.selectedTrans.length);
    expect(state.verifiedTrans).toHaveLength(initialState.verifiedTrans.length);
    expect(state.chain).toHaveLength(initialState.chain.length);

    userEvent.click(screen.getByRole("button", { name: /Add Block/i }));

    // once block is added to blockchain
    await waitFor(() => expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("invalid-block"));
    expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");
    expect(state.selectedTrans).toHaveLength(0);
    expect(state.verifiedTrans).toHaveLength(initialState.verifiedTrans.length - initialState.selectedTrans.length);
    expect(state.chain).toHaveLength(initialState.chain.length + 1);

    await waitFor(() =>
      expect(screen.getByRole("form", { name: /Block Form/i })).toHaveFormValues({
        index: initialState.preview.index + 1,
        timestamp: 67890,
        prevHash: solution,
        currHash: "",
        merkleRoot: ""
      })
    );
  });
});

describe("in blockchain mode", () => {
  // add an extra block to the chain to validate propagation
  const ogChain = [...initialState.chain];
  ogChain.push({
    index: 3,
    prevHash: new Array(64).fill("Z").join(""),
    currHash: new Array(64).fill("Y").join(""),
    transactions: [
      {
        to: "Z",
        from: "Y",
        amount: 123.45,
        message: "Fifth Transaction",
        signature: "ZY123.45"
      }
    ],
    timestamp: Date.parse("01 May 2021 00:00:00 UTC"),
    merkleRoot: "123.45ZFifthTransactionY123.45Z",
    valid: false,
    showTrans: true
  });

  const newState = { ...initialState, chain: ogChain };

  it.each`
    type
    ${"valid"}
    ${"invalid"}
  `("starts off invalid, after mining it stays $type, propagates to future blocks", async ({ type }) => {
    const solution =
      "000" + (type === "valid" ? "x" : "z") + "4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
    const target = "000y4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
    const index = 2;
    Date.now = jest.fn().mockReturnValueOnce(12345);
    jest.spyOn(ConversionUtil, "randomHash").mockReturnValue("random");
    jest
      .spyOn(ConversionUtil, "digestMessage")
      .mockResolvedValue("currHash")
      .mockResolvedValueOnce(target)
      .mockResolvedValueOnce(solution);
    const dispatchMock = jest.fn();

    const { asFragment } = render(
      <BlockStatisticsWrapper chain={true} index={index} stateMock={newState} dispatchMock={dispatchMock} />
    );

    expect(screen.getByRole("form", { name: /Block Statistics/i })).toHaveFormValues({
      nonce: 0,
      header: 0,
      target: "",
      solution: ""
    });

    expect(screen.getByRole("form", { name: /Block Form/i })).toHaveFormValues({
      ...initialState.chain[index],
      valid: undefined,
      transactions: undefined,
      showTrans: undefined
    });

    expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();
    expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("invalid-block");
    expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");

    expect(asFragment()).toMatchSnapshot();

    userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

    // once mining is complete
    await waitFor(() => expect(screen.getByRole("status")).toHaveClass("invisible"));

    expect(dispatchMock).toHaveBeenCalledTimes(2);
    expect(dispatchMock).toHaveBeenNthCalledWith(1, {
      type: ACTIONS.UPDATE_BLOCK,
      payload: {
        block: {
          ...newState.chain[index],
          timestamp: 12345,
          prevHash: initialState.chain[index - 1].currHash,
          currHash: solution,
          valid: type === "valid"
        }
      }
    });
    expect(dispatchMock).toHaveBeenNthCalledWith(2, {
      type: ACTIONS.UPDATE_BLOCK,
      payload: {
        block: [
          {
            ...newState.chain[index + 1],
            timestamp: 12345,
            prevHash: solution,
            currHash: "currHash",
            valid: false
          }
        ]
      }
    });
  });

  it.each`
    type
    ${"valid"}
    ${"invalid"}
  `("starts off invalid, after mining it stays $type, does not propagate since last", async ({ type }) => {
    const solution =
      "000" + (type === "valid" ? "x" : "z") + "4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
    const target = "000y4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
    const index = 3;
    Date.now = jest.fn().mockReturnValueOnce(12345);
    jest.spyOn(ConversionUtil, "randomHash").mockReturnValue("random");
    jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce(target).mockResolvedValueOnce(solution);
    const dispatchMock = jest.fn();

    const { asFragment } = render(
      <BlockStatisticsWrapper chain={true} index={index} stateMock={newState} dispatchMock={dispatchMock} />
    );

    expect(screen.getByRole("form", { name: /Block Statistics/i })).toHaveFormValues({
      nonce: 0,
      header: 0,
      target: "",
      solution: ""
    });

    expect(screen.getByRole("form", { name: /Block Form/i })).toHaveFormValues({
      ...initialState.chain[index],
      valid: undefined,
      transactions: undefined,
      showTrans: undefined
    });

    expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();
    expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("invalid-block");
    expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");

    expect(asFragment()).toMatchSnapshot();

    userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

    // once mining is complete
    await waitFor(() => expect(screen.getByRole("status")).toHaveClass("invisible"));
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: ACTIONS.UPDATE_BLOCK,
      payload: {
        block: {
          ...newState.chain[index],
          timestamp: 12345,
          prevHash: initialState.chain[index - 1].currHash,
          currHash: solution,
          valid: type === "valid"
        }
      }
    });
  });
});
