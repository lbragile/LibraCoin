/**
 * @group unit
 */

import React from "react";
import { screen } from "@testing-library/react";

import * as ConversionUtil from "../../../src/utils/conversion";

import PreviewTree from "../../../src/components/Block/PreviewTree";
import { customRender } from "../../utils/testUtils";

const { initialState } = global;

it("renders correctly", async () => {
  const { asFragment } = customRender(<PreviewTree />);

  expect(await screen.findByRole("heading", { level: 3 })).toBeInTheDocument();
  expect(await screen.findByRole("grid", { name: /Preview Table/i })).toBeInTheDocument();
  expect(screen.queryByText("Please select a verified transaction from above...")).not.toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});

test("0 selected transactions", async () => {
  const { asFragment } = customRender(<PreviewTree />, { stateMock: { ...initialState, selectedTrans: [] } });

  expect(await screen.findByRole("heading", { level: 3 })).toBeInTheDocument();
  expect(screen.queryByRole("grid", { name: /Preview Table/i })).not.toBeInTheDocument();
  expect(await screen.findByText("Please select a verified transaction from above...")).toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});

test.each`
  num
  ${1}
  ${2}
  ${3}
  ${4}
`("$num selected transactions", async ({ num }) => {
  jest.spyOn(ConversionUtil, "digestMessage").mockResolvedValue("random message");
  const selectedTrans = [...initialState.verifiedTrans.slice(0, num)];
  const { asFragment } = customRender(<PreviewTree />, { stateMock: { ...initialState, selectedTrans } });

  expect(await screen.findByRole("heading", { level: 3 })).toBeInTheDocument();
  expect(await screen.findByRole("grid", { name: /Preview Table/i })).toBeInTheDocument();
  expect(screen.queryByText("Please select a verified transaction from above...")).not.toBeInTheDocument();

  // when 3 transactions are selected, one of them is repeated in the preview at the second row
  selectedTrans.forEach((trans) => {
    const isRepeatedSig = num === 3 && trans.signature === selectedTrans[selectedTrans.length - 1].signature;
    expect(screen.getAllByTitle(trans.signature)).toHaveLength(Number(isRepeatedSig) + 1);
  });

  expect(asFragment()).toMatchSnapshot();
});
