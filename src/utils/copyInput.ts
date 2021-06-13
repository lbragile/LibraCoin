import React from "react";
import { ACTIONS } from "../enums/AppDispatchActions";
import { IAction } from "../typings/AppTypes";

export function copyInput(
  target: HTMLTextAreaElement | HTMLInputElement,
  assignName: string,
  dispatch: React.Dispatch<IAction>
): void {
  if (!target.value.includes("◦")) {
    target.select();
    document.execCommand("copy");
    dispatch({ type: ACTIONS.ASSIGN_COPIED, payload: { copied: assignName } });
  } else {
    target.blur();
  }
}

export function removeCopied(dispatch: React.Dispatch<IAction>): void {
  dispatch({ type: ACTIONS.ASSIGN_COPIED, payload: { copied: "" } });
}
