import { ACTIONS } from "../enums/AppDispatchActions";

export interface ITransaction {
  amount: number;
  from: string;
  msg: string;
  to: string;
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
  valid: boolean;
  showTrans?: boolean;
}
export interface IState {
  verifiedTrans: ITransaction[];
  selectedTrans: ITransaction[];
  users: IUser[];
  user: IMainUser;
  chain: IBlock[];
  copied: string;
  preview: IBlock;
  wallet: { sent: boolean; signed: boolean; validated: boolean; details: ITransaction };
}

export interface IAction {
  type: ACTIONS;
  payload?: unknown;
}
