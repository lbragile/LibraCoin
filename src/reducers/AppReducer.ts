import { ACTIONS } from "../enums/AppDispatchActions";
import { IAction, IState, IUser, ITransaction, IBlock } from "../typings/AppTypes";

export const AppReducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTIONS.UPDATE_VERIFIED_TRANS: {
      const verifiedTrans = filterVerifiedTrans(state.selectedTrans, state.verifiedTrans);
      return { ...state, verifiedTrans };
    }

    case ACTIONS.UPDATE_SELECTED_TRANS: {
      return { ...state, selectedTrans: (action.payload as { selectedTrans: ITransaction[] }).selectedTrans };
    }

    case ACTIONS.UPDATE_USERS: {
      return { ...state, users: (action.payload as { users: IUser[] }).users };
    }

    case ACTIONS.ADD_BLOCK: {
      return { ...state, chain: [...state.chain, (action.payload as { block: IBlock }).block] };
    }

    default:
      return state;
  }
};

export function filterVerifiedTrans(selectedTrans: ITransaction[], verifiedTrans: ITransaction[]): ITransaction[] {
  const selectedTransSignatures = selectedTrans.map((x) => x.signature);
  return verifiedTrans.filter((x) => !selectedTransSignatures.includes(x.signature));
}
