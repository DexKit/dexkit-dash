import IntlMessages from '@crema/utility/IntlMessages';
import {Button} from '@material-ui/core';
import {useChainInfo} from 'hooks/useChainInfo';
import {useWeb3} from 'hooks/useWeb3';
import {useSnackbar} from 'notistack';
import React, {useCallback, useEffect} from 'react';
import {useIntl} from 'react-intl';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {updateTransaction} from 'redux/_transactions/actions';
import {TransactionStatus} from 'redux/_transactions/types';
import {getProviderByChainId} from 'services/networkProvider';
import {Web3State} from 'types/blockchain';
import {isTransactionMined} from 'utils/blockchain';

export function TransactionManager() {
  const {enqueueSnackbar} = useSnackbar();

  const {transactions} = useSelector<AppState, AppState['transactions']>(
    ({transactions}) => transactions || [],
  );

  const dispatch = useDispatch();

  const {messages} = useIntl();

  const {getProvider, chainId, web3State} = useWeb3();

  const {getScannerUrl} = useChainInfo();

  const handleViewTransaction = useCallback(
    (chainId: number, hash: string) => {
      window.open(`${getScannerUrl(chainId)}/tx/${hash}`, '_blank');
    },
    [getScannerUrl],
  );

  useEffect(() => {
    if (transactions !== undefined && web3State === Web3State.Done) {
      const pendingTransactions = transactions?.filter(
        (t) => t.status === TransactionStatus.Pending,
      );

      const intervals: {[key: string]: any} = {};

      if (pendingTransactions !== undefined && pendingTransactions.length > 0) {
        pendingTransactions.forEach((tx) => {
          let currProvider = getProvider();

          if (chainId !== tx.chainId) {
            currProvider = getProviderByChainId(tx.chainId);
          }

          isTransactionMined(currProvider, tx.hash)
            .then((receipt) => {
              if (receipt !== undefined && receipt.confirmations > 0) {
                if ((receipt.status || 0) === 1) {
                  dispatch(
                    updateTransaction({
                      index: transactions?.indexOf(tx),
                      transaction: {
                        ...tx,
                        status: TransactionStatus.Confirmed,
                      },
                    }),
                  );

                  enqueueSnackbar(
                    messages['app.common.transactionConfirmed'] as string,
                    {
                      variant: 'success',
                      autoHideDuration: 5000,
                      action: (
                        <Button
                          onClick={() =>
                            handleViewTransaction(tx.chainId, tx.hash)
                          }>
                          <IntlMessages id='app.common.view' />
                        </Button>
                      ),
                    },
                  );
                } else if ((receipt.status || 0) === 0) {
                  dispatch(
                    updateTransaction({
                      index: transactions?.indexOf(tx),
                      transaction: {...tx, status: TransactionStatus.Failed},
                    }),
                  );
                }
              }

              clearInterval(intervals[tx.hash]);
            })
            .catch((err) => console.log('confirma erro', err));
        });
      }

      return () => {
        for (let key of Object.keys(intervals)) {
          clearInterval(intervals[key]);
        }
      };
    }
    // eslint-disable-next-line
  }, [
    dispatch,
    web3State, // eslint-disable-next-line
    String(transactions),
    getProvider,
    enqueueSnackbar,
    handleViewTransaction,
    messages,
    chainId,
  ]);

  return <></>;
}
