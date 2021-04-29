import React from "react";
import { IAction, IState } from "../typings/AppTypes";

type TAppContext = { state: IState; dispatch: React.Dispatch<IAction> } | undefined;

export const AppContext = React.createContext<TAppContext>(undefined);
