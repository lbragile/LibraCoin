import { ITransaction } from "../components/ItemLineUI/ItemLineUI";
import { ACTIONS } from "../enums/AppDispatchActions";
import { IAction, IState, IUser } from "../typings/AppTypes";

export const AppReducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTIONS.UPDATE_VERIFIED_TRANS: {
      const selectedTransSignatures = state.selectedTrans.map((x) => x.signature);
      const verifiedTrans = state.verifiedTrans.filter((x) => !selectedTransSignatures.includes(x.signature));
      return { ...state, verifiedTrans };
    }

    case ACTIONS.UPDATE_SELECTED_TRANS: {
      return { ...state, selectedTrans: (action.payload as { selectedTrans: ITransaction[] }).selectedTrans };
    }

    case ACTIONS.UPDATE_USERS: {
      return { ...state, users: (action.payload as { users: IUser[] }).users };
    }

    default:
      return state;
  }
};
