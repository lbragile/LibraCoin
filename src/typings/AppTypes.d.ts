import { ACTIONS } from "../enums/AppDispatchActions";

export interface IUser {
  publicKey: string;
  balance: number;
}

export interface ITransaction {
  to: string;
  from: string;
  amount: number;
  message: string;
  signature: string;
}
export interface IState {
  verifiedTrans: ITransaction[];
  selectedTrans: ITransaction[];
  users: IUser[];
}

export interface IAction {
  type: ACTIONS;
  payload?: unknown;
}
