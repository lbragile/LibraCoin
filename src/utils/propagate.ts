import { ACTIONS } from "../enums/AppDispatchActions";
import { IAction, IBlock, IState, ITransaction } from "../typings/AppTypes";
import { digestMessage } from "./conversion";

export async function propagateBlockStatus(
  state: IState,
  dispatch: React.Dispatch<IAction>,
  block: IBlock,
  prevHash: string,
  skipFirstUpdate: boolean,
  newRoot?: string,
  transactions?: ITransaction[],
  timestamp = Date.now()
): Promise<void> {
  const index = block.index;

  for (let i = index; i < state.chain.length; i++) {
    const merkleRoot = newRoot && i === index ? newRoot : state.chain[i].merkleRoot;
    const currHash = i === index ? prevHash : await digestMessage(i + prevHash + merkleRoot);
    const valid = skipFirstUpdate ? i === index : false;
    const showTrans = state.chain[i].showTrans ?? false;
    prevHash = i === index ? block.prevHash : prevHash;
    transactions = i === index && transactions ? transactions : state.chain[i].transactions;

    const newBlock = { index: i, timestamp, prevHash, currHash, transactions, merkleRoot, valid, showTrans };

    prevHash = currHash; // next block's prevHash is this block's currHash

    dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { block: newBlock } });
  }
}
