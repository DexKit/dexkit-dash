import {
  CLEAR_TRANSACTIONS,
  SAVE_TRANSACTION,
  UPDATE_TRANSACTION,
} from './actions';
import {ChangellyTransaction} from 'types/changelly';

export interface SwapState {
  transactions: ChangellyTransaction[];
}

const initialSettings: SwapState = {
  transactions: [],
};

export default (state: SwapState = initialSettings, action: any): SwapState => {
  switch (action.type) {
    case SAVE_TRANSACTION:
      return {
        ...state,
        transactions: [action.transaction, ...state.transactions],
      };
    case CLEAR_TRANSACTIONS:
      return {
        ...state,
        transactions: [],
      };
    case UPDATE_TRANSACTION:
      const newTransactions = state.transactions;

      const removeIndex = newTransactions.findIndex(
        (tx: ChangellyTransaction) => tx.id == action.transaction.id,
      );

      newTransactions[removeIndex] = action.transaction;

      return {
        ...state,
        transactions: [...newTransactions],
      };
    default:
      return state;
  }
};
