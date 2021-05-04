import { ACTIONS } from "../enums/AppDispatchActions";

export interface ITransaction {
  to: string;
  from: string;
  amount: number | undefined;
  message: string;
  signature: string;
}

export interface IUser {
  publicKey: string;
  balance: number;
}

export interface IBlock {
  index: number;
  prevHash: string;
  currHash: string;
  transactions: ITransaction[];
  timestamp: number;
  merkleRoot: string;
  valid?: boolean;
}
export interface IState {
  verifiedTrans: ITransaction[];
  selectedTrans: ITransaction[];
  users: IUser[];
  chain: IBlock[];
}

export interface IAction {
  type: ACTIONS;
  payload?: unknown;
}
