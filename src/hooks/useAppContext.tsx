import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { IAction, IState } from "../typings/AppTypes";

interface IAppContext {
  state: IState;
  dispatch: React.Dispatch<IAction>;
}

export function useAppContext(): IAppContext {
  const { state, dispatch } = useContext(AppContext) as IAppContext;
  return { state, dispatch };
}
