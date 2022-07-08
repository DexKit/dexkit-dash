import {useCallback, useState} from 'react';
import {Game} from 'types/coinleague';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {useNotifications} from 'hooks/useNotifications';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {useIntl} from 'react-intl';
import {useChainInfo} from 'hooks/useChainInfo';
import {useSnackbar} from 'notistack';
import {Button} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import React from 'react';
import {useCoinLeagueV3Callbacks} from '../useCoinLeagueFactoryV3';

export function useGameStart({
  game,
  onError,
  onConfirm,
}: {
  game?: Game;
  onError: (error: Error) => void;
  onConfirm: () => void;
}) {
  const {getScannerUrl} = useChainInfo();

  const {enqueueSnackbar} = useSnackbar();

  const {formatMessage, messages} = useIntl();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();
  const [confirmed, setConfirmed] = useState<boolean>();

  const {chainId} = useLeaguesChainInfo();

  const {createNotification} = useNotifications();

  const {onStartGameCallback} = useCoinLeagueV3Callbacks(game?.id.toString());

  const reset = useCallback(() => {
    setTransactionHash(undefined);
    setConfirmed(undefined);
    setError(undefined);
  }, []);

  const handleViewTransaction = useCallback(
    (chainId: number, hash: string) => {
      window.open(`${getScannerUrl(chainId)}/tx/${hash}`, '_blank');
    },
    [getScannerUrl],
  );

  const start = useCallback(
    (ev: any) => {
      if (game?.amount_to_play && chainId) {
        setIsLoading(true);
        const onSubmitTx = (hash: string) => {
          setTransactionHash(hash);
          enqueueSnackbar(
            formatMessage({
              id: 'coinLeague.transactionCreated',
              defaultMessage: 'Transaction created',
            }),
            {
              variant: 'success',
              autoHideDuration: 5000,
              action: (
                <Button onClick={() => handleViewTransaction(chainId, hash)}>
                  <IntlMessages id='coinLeague.view' defaultMessage='View' />
                </Button>
              ),
            },
          );

          createNotification({
            title: messages['coinLeague.startGame'] as string,
            body: `${messages['coinLeague.startingGame'] as string} ${game.id}`,
            timestamp: Date.now(),
            url: getTransactionScannerUrl(chainId, hash),
            urlCaption: messages['coinLeague.viewTransaction'] as string,
            type: NotificationType.TRANSACTION,
            metadata: {
              chainId: chainId,
              transactionHash: hash,
              status: 'pending',
            } as TxNotificationMetadata,
          });
        };

        const onConfirmTx = () => {
          if (onConfirm) {
            onConfirm();
          }
          setConfirmed(true);
          setIsLoading(false);
        };

        const onCallbackError = (error: Error) => {
          if (onError) {
            onError(error);
          }
          setIsLoading(false);
        };

        onStartGameCallback({
          onConfirmation: onConfirmTx,
          onError: onCallbackError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [
      game,
      onStartGameCallback,
      chainId,
      createNotification,
      enqueueSnackbar,
      formatMessage,
      handleViewTransaction,
      messages,
      onConfirm,
      onError,
    ],
  );

  return {
    reset,
    start,
    transactionHash,
    isLoading,
    confirmed,
    error,
    onConfirm,
  };
}
