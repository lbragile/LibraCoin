/**
 * @group integration
 */

import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Mine from "../../src/pages/Mine";
import * as ConversionUtil from "../../src/utils/conversion";
import { customRender } from "../utils/testUtils";

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
  expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("invalid-block");
  expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");

  const verifiedTrans = screen.getAllByRole("form", { name: /Transaction Information/i });
  const selectedTrans = verifiedTrans.filter((trans) => trans.classList.contains("selected"));
  expect(verifiedTrans).toHaveLength(initialState.verifiedTrans.length);
  expect(selectedTrans).toHaveLength(initialState.selectedTrans.length);

  expect(asFragment()).toMatchSnapshot();

  userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

  // once mining is complete
  await waitFor(() => expect(screen.getByRole("status")).toHaveClass("invisible"));
  expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("invalid-block");
  expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");
  expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();

  const newVerifiedTrans = screen.getAllByRole("form", { name: /Transaction Information/i });
  const newSelectedTrans = newVerifiedTrans.filter((trans) => trans.classList.contains("selected"));
  expect(newVerifiedTrans).toStrictEqual(verifiedTrans);
  expect(newSelectedTrans).toStrictEqual(selectedTrans);
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
  expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("invalid-block");
  expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");

  const verifiedTrans = screen.getAllByRole("form", { name: /Transaction Information/i });
  const selectedTrans = verifiedTrans.filter((trans) => trans.classList.contains("selected"));
  expect(verifiedTrans).toHaveLength(initialState.verifiedTrans.length);
  expect(selectedTrans).toHaveLength(initialState.selectedTrans.length);

  expect(asFragment()).toMatchSnapshot();

  userEvent.click(screen.getByRole("button", { name: /Block Mine/i }));

  // once mining is complete
  await waitFor(() => expect(screen.getByRole("status")).toHaveClass("invisible"));
  expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("valid-block");
  expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("valid-solution");
  expect(screen.getByRole("button", { name: /Add Block/i })).toBeInTheDocument();

  const afterMiningVerifiedTrans = screen.getAllByRole("form", { name: /Transaction Information/i });
  const afterMiningSelectedTrans = afterMiningVerifiedTrans.filter((trans) => trans.classList.contains("selected"));
  expect(afterMiningVerifiedTrans).toStrictEqual(verifiedTrans);
  expect(afterMiningSelectedTrans).toStrictEqual(selectedTrans);

  userEvent.click(screen.getByRole("button", { name: /Add Block/i }));

  // once block is added to blockchain
  await waitFor(() => expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("invalid-block"));
  expect(screen.getByRole("textbox", { name: /Block Solution/i })).toHaveClass("invalid-solution");

  expect(screen.getAllByRole("form", { name: /Transaction Information/i })).toHaveLength(
    verifiedTrans.length - initialState.selectedTrans.length
  );

  const afterAddVerifiedTrans = screen.getAllByRole("form", { name: /Transaction Information/i });
  const afterAddSelectedTrans = afterAddVerifiedTrans.filter((trans) => trans.classList.contains("selected"));
  expect(afterAddSelectedTrans).toEqual([]);
  expect(afterAddVerifiedTrans).toStrictEqual(
    verifiedTrans.filter((trans) => trans.classList.contains("not-selected"))
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
