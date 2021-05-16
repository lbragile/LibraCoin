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

export interface IMainUser extends IUser {
  privateKey: string;
}

export interface IBlock {
  index: number;
  prevHash: string;
  currHash: string;
  transactions: ITransaction[];
  timestamp: number;
  merkleRoot: string;
  valid?: boolean;
  showTrans?: boolean;
}
export interface IState {
  verifiedTrans: ITransaction[];
  selectedTrans: ITransaction[];
  users: IUser[];
  user: IMainUser;
  chain: IBlock[];
}

export interface IAction {
  type: ACTIONS;
  payload?: unknown;
}
