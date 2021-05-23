import { ACTIONS } from "../enums/AppDispatchActions";
import { IAction, IBlock, IState, ITransaction } from "../typings/AppTypes";
import { digestMessage } from "./conversion";

export async function propagateBlockStatus(
  state: IState,
  dispatch: React.Dispatch<IAction>,
  index: number,
  prevHash: string,
  currHash: string,
  skipFirstUpdate: boolean,
  newRoot?: string,
  transactions?: ITransaction[]
): Promise<void> {
  const newBlocks: IBlock[] = [];
  for (let i = index; i < state.chain.length; i++) {
    const merkleRoot = newRoot && i === index ? newRoot : state.chain[i].merkleRoot;
    const valid = skipFirstUpdate && i === index;
    const showTrans = state.chain[i].showTrans ?? false;
    currHash = i === index ? currHash : await digestMessage(i + prevHash + merkleRoot);
    transactions = i === index && transactions ? transactions : state.chain[i].transactions;

    newBlocks.push({ index: i, timestamp: Date.now(), prevHash, currHash, transactions, merkleRoot, valid, showTrans });

    prevHash = currHash; // next block's prevHash is this block's currHash
  }

  dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { block: newBlocks } });
}
