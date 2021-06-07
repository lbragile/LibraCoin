import { ACTIONS } from "../enums/AppDispatchActions";
import { IAction, IState, IUser, ITransaction, IBlock, IMainUser } from "../typings/AppTypes";

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const AppReducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTIONS.ADD_VERIFIED_TRANS: {
      const { trans } = action.payload as { trans: ITransaction };
      const verifiedTrans = [...state.verifiedTrans, deepCopy(trans)];
      localStorage.setItem("verTrans", JSON.stringify(verifiedTrans, null, 2));
      return { ...state, verifiedTrans };
    }

    case ACTIONS.UPDATE_VERIFIED_TRANS: {
      const selectedTransSignatures = state.selectedTrans.map((x) => x.signature);
      const verifiedTrans = state.verifiedTrans.filter((x) => !selectedTransSignatures.includes(x.signature));
      localStorage.setItem("verTrans", JSON.stringify(verifiedTrans, null, 2));
      return { ...state, verifiedTrans };
    }

    case ACTIONS.UPDATE_SELECTED_TRANS: {
      const { selectedTrans } = action.payload as { selectedTrans: ITransaction[] };
      localStorage.setItem("selTrans", JSON.stringify(selectedTrans, null, 2));
      return { ...state, selectedTrans };
    }

    case ACTIONS.UPDATE_USERS: {
      const { users } = action.payload as { users: IUser[] };
      localStorage.setItem("users", JSON.stringify(users, null, 2));
      return { ...state, users };
    }

    case ACTIONS.SET_MAIN_USER: {
      const { user } = action.payload as { user: IMainUser };
      localStorage.setItem("user", JSON.stringify(user, null, 2));
      return { ...state, user };
    }

    case ACTIONS.ADD_BLOCK: {
      const { block } = action.payload as { block: IBlock };
      const chain = [...deepCopy(state.chain), deepCopy(block)];
      localStorage.setItem("chain", JSON.stringify(chain, null, 2));
      return { ...state, chain };
    }

    case ACTIONS.UPDATE_BLOCK: {
      const { block } = action.payload as { block: IBlock | IBlock[] };
      const blocks = Array.isArray(block) ? deepCopy(block) : [deepCopy(block)];
      const chain = deepCopy(state.chain);

      blocks.forEach((b) => (chain[b.index] = deepCopy(b)));

      localStorage.setItem("chain", JSON.stringify(chain, null, 2));
      return { ...state, chain };
    }

    case ACTIONS.UPDATE_PREVIEW: {
      const { preview } = action.payload as { preview: IBlock };
      localStorage.setItem("preview", JSON.stringify(preview, null, 2));
      return { ...state, preview: deepCopy(preview) };
    }

    default:
      return state;
  }
};
