/**
 * @group utils
 */

import { ACTIONS } from "../../src/enums/AppDispatchActions";
import { copyInput, removeCopied } from "../../src/utils/copyInput";

describe("copyInput", () => {
  let target: HTMLTextAreaElement;

  beforeEach(() => {
    document.execCommand = jest.fn();
    target = document.createElement("textarea");
  });

  afterEach(() => jest.restoreAllMocks());

  it('copies input that has a visible value (not "◦")', () => {
    const dispatchMock = jest.fn();
    const selectSpy = jest.spyOn(target, "select");
    target.value = "visible-value";

    copyInput(target, "randomName", dispatchMock);

    expect(selectSpy).toHaveBeenCalledTimes(1);

    expect(document.execCommand).toHaveBeenCalledTimes(1);
    expect(document.execCommand).toHaveBeenCalledWith("copy");

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({ type: ACTIONS.ASSIGN_COPIED, payload: { copied: "randomName" } });
  });

  it('blurs if input value is not visible (contains "◦")', () => {
    const dispatchMock = jest.fn();
    const blurSpy = jest.spyOn(target, "blur");
    target.value = "◦◦◦◦◦";

    copyInput(target, "randomName", dispatchMock);

    expect(document.execCommand).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
    expect(blurSpy).toHaveBeenCalledTimes(1);
  });
});

test("removeCopied", () => {
  const dispatchMock = jest.fn();

  removeCopied(dispatchMock);

  expect(dispatchMock).toHaveBeenCalledTimes(1);
  expect(dispatchMock).toHaveBeenCalledWith({ type: ACTIONS.ASSIGN_COPIED, payload: { copied: "" } });
});
