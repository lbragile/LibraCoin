import { ITransaction } from "../components/ItemLineUI/ItemLineUI";
import { ACTIONS } from "../enums/AppDispatchActions";

export interface IUser {
  publicKey: string;
  balance: number;
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
