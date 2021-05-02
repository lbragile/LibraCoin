import { ACTIONS } from "../enums/AppDispatchActions";
import { IAction, IState, IUser, ITransaction, IBlock } from "../typings/AppTypes";

export const AppReducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTIONS.ADD_VERIFIED_TRANS: {
      const newTrans = (action.payload as { trans: ITransaction }).trans;
      const prevTrans = JSON.parse(localStorage.getItem("transactions") as string) ?? [];
      const verifiedTrans = [...prevTrans, newTrans];
      localStorage.setItem("transactions", JSON.stringify(verifiedTrans));
      return { ...state, verifiedTrans };
    }

    case ACTIONS.UPDATE_VERIFIED_TRANS: {
      const selectedTransSignatures = state.selectedTrans.map((x) => x.signature);
      const verifiedTrans = state.verifiedTrans.filter((x) => !selectedTransSignatures.includes(x.signature));
      localStorage.setItem("transactions", JSON.stringify(verifiedTrans));
      return { ...state, verifiedTrans };
    }

    case ACTIONS.UPDATE_SELECTED_TRANS: {
      const selectedTrans = (action.payload as { selectedTrans: ITransaction[] }).selectedTrans;
      localStorage.setItem("selectedTransactions", JSON.stringify(selectedTrans));
      return { ...state, selectedTrans };
    }

    case ACTIONS.UPDATE_USERS: {
      const users = (action.payload as { users: IUser[] }).users;
      localStorage.setItem("users", JSON.stringify(users));
      return { ...state, users };
    }

    case ACTIONS.ADD_BLOCK: {
      const chain = [...state.chain, (action.payload as { block: IBlock }).block];
      localStorage.setItem("chain", JSON.stringify(chain));
      return { ...state, chain };
    }

    default:
      return state;
  }
};
