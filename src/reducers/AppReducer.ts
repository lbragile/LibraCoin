import { ACTIONS } from "../enums/AppDispatchActions";
import { IAction, IState, IUser, ITransaction, IBlock, IMainUser } from "../typings/AppTypes";

export const AppReducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTIONS.ADD_VERIFIED_TRANS: {
      const { trans } = action.payload as { trans: ITransaction };
      return { ...state, verifiedTrans: [...state.verifiedTrans, { ...trans }] };
    }

    case ACTIONS.UPDATE_VERIFIED_TRANS: {
      const selectedTransSignatures = state.selectedTrans.map((x) => x.signature);
      const verifiedTrans = state.verifiedTrans.filter((x) => !selectedTransSignatures.includes(x.signature));
      return { ...state, verifiedTrans };
    }

    case ACTIONS.UPDATE_SELECTED_TRANS: {
      const { selectedTrans } = action.payload as { selectedTrans: ITransaction[] };
      return { ...state, selectedTrans };
    }

    case ACTIONS.UPDATE_USERS: {
      const { users } = action.payload as { users: IUser[] };
      return { ...state, users };
    }

    case ACTIONS.SET_MAIN_USER: {
      const { user } = action.payload as { user: IMainUser };
      return { ...state, user };
    }

    case ACTIONS.ADD_BLOCK: {
      const { block } = action.payload as { block: IBlock };
      return { ...state, chain: [...state.chain, { ...block }] };
    }

    case ACTIONS.UPDATE_BLOCK: {
      const { block } = action.payload as { block: IBlock | IBlock[] };
      const blocks = Array.isArray(block) ? [...block] : [block];
      const chain = [...state.chain];

      blocks.forEach((b) => (chain[b.index] = { ...b }));

      return { ...state, chain };
    }

    case ACTIONS.UPDATE_PREVIEW: {
      const { preview } = action.payload as { preview: IBlock };
      return { ...state, preview: { ...preview } };
    }

    case ACTIONS.ASSIGN_COPIED: {
      const { copied } = action.payload as { copied: string };
      return { ...state, copied };
    }

    case ACTIONS.SET_SIGNED: {
      const { signed, sent } = action.payload as { signed: boolean; sent?: boolean };
      const newSent = sent !== undefined ? sent : !signed;
      return { ...state, wallet: { ...state.wallet, signed, sent: newSent } };
    }

    case ACTIONS.SET_VALIDATED: {
      const { validated } = action.payload as { validated: boolean };
      return { ...state, wallet: { ...state.wallet, validated } };
    }

    case ACTIONS.SET_DETAILS: {
      const { details } = action.payload as { details: ITransaction };
      return { ...state, wallet: { ...state.wallet, details } };
    }

    default:
      return state;
  }
};
