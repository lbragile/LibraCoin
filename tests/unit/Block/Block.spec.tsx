import React, { useReducer } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { AppContext } from "../../../src/context/AppContext";
import Block from "../../../src/components/Block/Block";
import { IAction, IState } from "../../../src/typings/AppTypes";
import { AppReducer } from "../../../src/reducers/AppReducer";
import { ACTIONS } from "../../../src/enums/AppDispatchActions";

const { initialState } = global;

interface IBlockWrapper {
  chain: boolean;
  index: number;
  stateMock?: IState;
  dispatchMock?: React.Dispatch<IAction>;
}

const BlockWrapper = ({ chain, index, stateMock, dispatchMock }: IBlockWrapper) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state: stateMock ?? state, dispatch: dispatchMock ?? dispatch }}>
      <Block chain={chain} index={index} />
    </AppContext.Provider>
  );
};

describe("in preview mode", () => {
  it("renders correctly", () => {
    Date.now = jest.fn().mockReturnValueOnce(initialState.preview.timestamp);

    const { asFragment } = render(<BlockWrapper chain={false} index={initialState.preview.index} />);

    expect(screen.getByRole("form", { name: /Block Form/i })).toHaveFormValues({
      ...initialState.preview,
      valid: undefined,
      transactions: undefined
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

  describe("Valid State", () => {
    it("Shows 'Add Block' button", () => {
      const { asFragment } = render(
        <BlockWrapper
          chain={false}
          index={initialState.preview.index}
          stateMock={{ ...initialState, preview: { ...initialState.preview, valid: true } }}
        />
      );

      expect(screen.getByRole("button", { name: /Add Block/i })).toHaveTextContent("Add Block");

      expect(asFragment()).toMatchSnapshot();
    });

    it("updates respective parameters when 'Add Block' button is pressed", () => {
      const blockPayload = {
        ...initialState.preview,
        transactions: initialState.selectedTrans,
        valid: initialState.chain[initialState.preview.index - 1].valid, // validity depends on previous block
        showTrans: false
      };

      const previewPayload = {
        index: initialState.preview.index + 1,
        timestamp: initialState.preview.timestamp,
        prevHash: initialState.preview.currHash,
        currHash: "",
        merkleRoot: "",
        valid: false
      };

      Date.now = jest.fn().mockReturnValueOnce(initialState.preview.timestamp);

      const dispatchMock = jest.fn();
      render(
        <BlockWrapper
          chain={false}
          index={initialState.preview.index}
          stateMock={{ ...initialState, preview: { ...initialState.preview, valid: true } }}
          dispatchMock={dispatchMock}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /Add Block/i }));

      expect(dispatchMock).toHaveBeenCalledTimes(4);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: ACTIONS.ADD_BLOCK, payload: { block: blockPayload } });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: ACTIONS.UPDATE_VERIFIED_TRANS });
      expect(dispatchMock).toHaveBeenNthCalledWith(3, {
        type: ACTIONS.UPDATE_SELECTED_TRANS,
        payload: { selectedTrans: [] }
      });
      expect(dispatchMock).toHaveBeenNthCalledWith(4, {
        type: ACTIONS.UPDATE_PREVIEW,
        payload: { preview: previewPayload }
      });
    });
  });
});