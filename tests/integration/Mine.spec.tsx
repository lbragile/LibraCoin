/**
 * @group integration
 */

import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Mine from "../../src/pages/Mine";
import * as ConversionUtil from "../../src/utils/conversion";
import { customRender } from "../utils/testUtils";
import { COLORS } from "../../src/enums/ColorPallet";

const { initialState } = global;

it("starts off invalid, and after mining it stays invalid (cannot be added to blockchain)", async () => {
  const solution = "000z4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
  const target = "000y4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";

  Date.now = jest.fn().mockReturnValueOnce(12345);
  jest.spyOn(ConversionUtil, "randomHash").mockReturnValue("random");
  jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce(target).mockResolvedValueOnce(solution);

  const { asFragment } = customRender(<Mine />);

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
  expect(screen.getByRole("form", { name: /Block Form/i })).toHaveStyle({ background: COLORS.INVALID_BACKGROUND });
  expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveStyle({ color: COLORS.INVALID_SOLUTION });

  const verifiedTrans = screen.getAllByRole("form", { name: /Transaction Information/i });
  const selectedTrans = screen.getAllByRole("form", { name: /Transaction Information Selected/i });
  expect(verifiedTrans).toHaveLength(initialState.verifiedTrans.length);
  expect(selectedTrans).toHaveLength(initialState.selectedTrans.length);

  expect(asFragment()).toMatchSnapshot();

  userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

  // once mining is complete
  await waitFor(() => expect(screen.getByRole("status")).toHaveClass("invisible"));
  expect(screen.getByRole("form", { name: /Block Form/i })).toHaveStyle({ background: COLORS.INVALID_BACKGROUND });
  expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveStyle({ color: COLORS.INVALID_SOLUTION });
  expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();

  expect(screen.getAllByRole("form", { name: /Transaction Information/i })).toStrictEqual(verifiedTrans);
  expect(screen.getAllByRole("form", { name: /Transaction Information Selected/i })).toStrictEqual(selectedTrans);
});

it("starts off invalid, but after mining turns valid, and is added to blockchain", async () => {
  const solution = "000a4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";
  const target = "000z4fda363405b2796986a63e8cedde080e1f29ed774f5f93bd97c42b9a96fc0";

  Date.now = jest.fn().mockReturnValueOnce(12345).mockReturnValueOnce(67890); // first time right after mining, second time in addition of block
  jest.spyOn(ConversionUtil, "randomHash").mockReturnValue("random");
  jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValueOnce(target).mockResolvedValueOnce(solution);

  const { asFragment } = customRender(<Mine />);

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
  expect(screen.getByRole("form", { name: /Block Form/i })).toHaveStyle({ background: COLORS.INVALID_BACKGROUND });
  expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveStyle({ color: COLORS.INVALID_SOLUTION });

  const verifiedTrans = screen.getAllByRole("form", { name: /Transaction Information/i });
  const selectedTrans = screen.getAllByRole("form", { name: /Transaction Information Selected/i });
  expect(verifiedTrans).toHaveLength(initialState.verifiedTrans.length);
  expect(selectedTrans).toHaveLength(initialState.selectedTrans.length);

  expect(asFragment()).toMatchSnapshot();

  userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

  // once mining is complete
  await waitFor(() => expect(screen.getByRole("status")).toHaveClass("invisible"));
  expect(screen.getByRole("form", { name: /Block Form/i })).toHaveStyle({ background: COLORS.VALID_BACKGROUND });
  expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveStyle({ color: COLORS.VALID_SOLUTION });
  expect(screen.getByRole("button", { name: /Add Block/i })).toBeInTheDocument();

  expect(screen.getAllByRole("form", { name: /Transaction Information/i })).toStrictEqual(verifiedTrans);
  expect(screen.getAllByRole("form", { name: /Transaction Information Selected/i })).toStrictEqual(selectedTrans);

  userEvent.click(screen.getByRole("button", { name: /Add Block/i }));

  // once block is added to blockchain
  await waitFor(() =>
    expect(screen.getByRole("form", { name: /Block Form/i })).toHaveStyle({ background: COLORS.INVALID_BACKGROUND })
  );
  expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveStyle({ color: COLORS.INVALID_SOLUTION });

  expect(screen.queryAllByRole("form", { name: /Transaction Information Selected/i })).toEqual([]);
  expect(screen.getAllByRole("form", { name: /Transaction Information/i })).toHaveLength(
    verifiedTrans.length - initialState.selectedTrans.length
  );
  expect(screen.getAllByRole("form", { name: /Transaction Information/i })).toStrictEqual(
    verifiedTrans.filter((trans) => !selectedTrans.includes(trans))
  );

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
