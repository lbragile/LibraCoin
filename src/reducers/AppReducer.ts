import { ACTIONS } from "../enums/AppDispatchActions";
import { IAction, IState, IUser, ITransaction, IBlock, IMainUser } from "../typings/AppTypes";

export const AppReducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTIONS.ADD_VERIFIED_TRANS: {
      const { trans } = action.payload as { trans: ITransaction };
      state.verifiedTrans.push(trans);
      localStorage.setItem("verTrans", JSON.stringify(state.verifiedTrans));
      return state;
    }

    case ACTIONS.UPDATE_VERIFIED_TRANS: {
      const selectedTransSignatures = state.selectedTrans.map((x) => x.signature);
      const verifiedTrans = state.verifiedTrans.filter((x) => !selectedTransSignatures.includes(x.signature));
      localStorage.setItem("verTrans", JSON.stringify(verifiedTrans));
      return { ...state, verifiedTrans };
    }

    case ACTIONS.UPDATE_SELECTED_TRANS: {
      const { selectedTrans } = action.payload as { selectedTrans: ITransaction[] };
      localStorage.setItem("selTrans", JSON.stringify(selectedTrans));
      return { ...state, selectedTrans };
    }

    case ACTIONS.UPDATE_USERS: {
      const { users } = action.payload as { users: IUser[] };
      localStorage.setItem("users", JSON.stringify(users));
      return { ...state, users };
    }

    case ACTIONS.SET_MAIN_USER: {
      const { user } = action.payload as { user: IMainUser };
      localStorage.setItem("user", JSON.stringify(user));
      return { ...state, user };
    }

    case ACTIONS.ADD_BLOCK: {
      const { block } = action.payload as { block: IBlock };
      state.chain.push(block);
      localStorage.setItem("chain", JSON.stringify(state.chain));
      return state;
    }

    case ACTIONS.UPDATE_BLOCK: {
      const { block } = action.payload as { block: IBlock };
      const ogState = JSON.parse(JSON.stringify(state));
      ogState.chain[block.index] = block;
      localStorage.setItem("chain", JSON.stringify(ogState.chain));
      return { ...ogState, chain: ogState.chain };
    }

    default:
      return state;
  }
};
