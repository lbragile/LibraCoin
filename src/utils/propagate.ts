import { ACTIONS } from "../enums/AppDispatchActions";
import { IAction, IBlock, IState, ITransaction } from "../typings/AppTypes";
import { digestMessage } from "./conversion";

export async function propagateBlockStatus(
  state: IState,
  dispatch: React.Dispatch<IAction>,
  details: IBlock,
  prevHash: string,
  skipFirstUpdate: boolean,
  newRoot?: string,
  transactions?: ITransaction[],
  timestamp = Date.now()
): Promise<void> {
  const index = details.index;

  for (let i = index; i < state.chain.length; i++) {
    const merkleRoot = newRoot && i === index ? newRoot : state.chain[i].merkleRoot;
    const currHash = i === index ? prevHash : await digestMessage(i + prevHash + merkleRoot);

    const newBlock = {
      index: i,
      timestamp,
      prevHash: i === index ? details.prevHash : prevHash,
      currHash,
      transactions: i === index && transactions ? transactions : state.chain[i].transactions,
      merkleRoot,
      valid: skipFirstUpdate ? i === index : false,
      showTrans: state.chain[i].showTrans ?? false
    };

    prevHash = currHash; // next block's prevHash is this block's currHash

    dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { block: newBlock } });
  }
}
