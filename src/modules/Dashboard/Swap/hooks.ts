import {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {AppState} from 'redux/store';
import {
  swapClearTransactions,
  swapSaveTransaction,
  swapUpdateTransaction,
} from 'redux/_swap/actions';
import {ChangellyTransaction} from 'types/changelly';

export function useSwapTransactions() {
  const dispatch = useDispatch();
  const {transactions} = useSelector<AppState, AppState['swap']>(
    ({swap}) => swap,
  );

  const saveTransaction = useCallback(
    (tx: ChangellyTransaction) => {
      dispatch(swapSaveTransaction(tx));
    },
    [dispatch],
  );

  const updateStatus = useCallback(
    (tx: ChangellyTransaction, status: string) => {
      let newTx = {...tx, status};
      dispatch(swapUpdateTransaction(newTx));
    },
    [transactions],
  );

  const clear = useCallback(() => {
    dispatch(swapClearTransactions());
  }, []);

  return {
    transactions: transactions || [],
    saveTransaction,
    updateStatus,
    clear,
  };
}
