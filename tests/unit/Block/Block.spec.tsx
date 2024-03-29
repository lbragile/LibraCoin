/**
 * @group unit
 */

import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Block from "../../../src/components/Block/Block";
import { ACTIONS } from "../../../src/enums/AppDispatchActions";
import { customRender } from "../../utils/testUtils";
import { COLORS } from "../../../src/enums/ColorPallet";

const { initialState } = global;

describe("in preview mode", () => {
  it("renders correctly", () => {
    const { asFragment } = customRender(<Block chain={false} index={initialState.preview.index} />);

    const block = screen.getByRole("form", { name: /Block Form/i });
    expect(block).toHaveStyle({ background: COLORS.INVALID_BACKGROUND });
    expect(block).toHaveFormValues({
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

  describe("valid State", () => {
    it("Shows 'Add Block' button", () => {
      const { asFragment } = customRender(<Block chain={false} index={initialState.preview.index} />, {
        stateMock: { ...initialState, preview: { ...initialState.preview, valid: true } }
      });

      expect(screen.getByRole("form", { name: /Block Form/i })).toHaveStyle({ background: COLORS.VALID_BACKGROUND });
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
      customRender(<Block chain={false} index={initialState.preview.index} />, {
        stateMock: { ...initialState, preview: { ...initialState.preview, valid: true } },
        dispatchMock
      });

      userEvent.click(screen.getByRole("button", { name: /Add Block/i }));

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

describe("in blockchain mode", () => {
  describe("renders correctly", () => {
    test("index === 0", () => {
      const { asFragment } = customRender(<Block chain={true} index={0} />);

      const block = screen.getByRole("form", { name: /Block Form/i });
      expect(block).toHaveStyle({ background: COLORS.VALID_BACKGROUND });
      expect(block).toHaveFormValues({
        ...initialState.chain[0],
        prevHash: "",
        merkleRoot: "",
        valid: undefined,
        transactions: undefined,
        showTrans: undefined
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

      const merkle = screen.getByRole("textbox", { name: /Block Merkle Genesis/i });
      expect(merkle).toBeDisabled();
      expect(merkle).not.toBeRequired();

      expect(screen.getByRole("textbox", { name: /Block Merkle Genesis/i })).toBeInTheDocument();
      expect(screen.queryByLabelText(/Show Trans/i)).not.toBeInTheDocument(); // index === 0 doesn't have transactions to show
      expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();

      expect(asFragment()).toMatchSnapshot();
    });

    describe("index > 0", () => {
      test.each`
        i    | expectedStyle
        ${1} | ${{ background: COLORS.VALID_BACKGROUND }}
        ${2} | ${{ background: COLORS.INVALID_BACKGROUND }}
      `("index → $i, class → $expectedClass", ({ i, expectedStyle }) => {
        const { asFragment } = customRender(<Block chain={true} index={i} />);

        const block = screen.getByRole("form", { name: /Block Form/i });
        expect(block).toHaveStyle(expectedStyle);
        expect(block).toHaveFormValues({
          ...initialState.chain[i],
          prevHash: initialState.chain[i - 1].currHash,
          valid: undefined,
          transactions: undefined,
          showTrans: undefined
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

        expect(screen.queryByRole("textbox", { name: /Block Merkle Genesis/i })).not.toBeInTheDocument();

        expect(screen.getByLabelText(/Show Trans/i)).toBeInTheDocument();
        expect(screen.getByText(i === 1 ? "🙉" : "🙈")).toBeInTheDocument();

        expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe("'Add Block' button", () => {
    it("is not present when block is valid", () => {
      const { asFragment } = customRender(<Block chain={true} index={1} />);

      expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();

      expect(asFragment()).toMatchSnapshot();
    });

    it("is not present when block is invalid", () => {
      const { asFragment } = customRender(<Block chain={true} index={2} />);

      expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("handleViewTransactions", () => {
    it("calls dispatch correctly", () => {
      const dispatchMock = jest.fn();
      customRender(<Block chain={true} index={1} />, { dispatchMock });

      userEvent.click(screen.getByText("🙉"));

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: ACTIONS.UPDATE_BLOCK,
        payload: { block: { ...initialState.chain[1], showTrans: true } }
      });
    });

    it("changes emoji when show transactions is clicked", async () => {
      const { asFragment } = customRender(<Block chain={true} index={1} />);

      expect(screen.getByText("🙉")).toBeInTheDocument();
      userEvent.click(screen.getByText("🙉"));
      expect(await screen.findByText("🙈")).toBeInTheDocument();
      expect(screen.queryByText("🙉")).not.toBeInTheDocument();

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
