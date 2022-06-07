import {useCallback, useState} from 'react';
import {Game} from 'types/coinsleague';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useCoinLeaguesCallbacks} from '../useCoinLeagues';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {useNotifications} from 'hooks/useNotifications';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {useIntl} from 'react-intl';
import {useSnackbar} from 'notistack';
import {Button} from '@material-ui/core';
import {useChainInfo} from 'hooks/useChainInfo';
import React from 'react';
import IntlMessages from '@crema/utility/IntlMessages';

export function useGameEnd({
  game,
  onError,
  onConfirm,
}: {
  game?: Game;
  onError?: (error: Error) => void;
  onConfirm?: () => void;
}) {
  const {getScannerUrl} = useChainInfo();

  const {enqueueSnackbar} = useSnackbar();
  const {formatMessage} = useIntl();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();
  const [confirmed, setConfirmed] = useState<boolean>();

  const {chainId} = useLeaguesChainInfo();

  const {createNotification} = useNotifications();

  const {onEndGameCallback} = useCoinLeaguesCallbacks(game?.address);

  const handleViewTransaction = useCallback(
    (chainId: number, hash: string) => {
      window.open(`${getScannerUrl(chainId)}/tx/${hash}`, '_blank');
    },
    [getScannerUrl],
  );

  const reset = useCallback(() => {
    setTransactionHash(undefined);
    setConfirmed(undefined);
    setError(undefined);
  }, []);

  const end = useCallback(
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
            title: formatMessage({
              id: 'coinLeague.endGame',
              defaultMessage: 'End Game',
            }) as string,
            body: `${formatMessage({
              id: 'coinLeague.endingGame',
              defaultMessage: 'Ending Game',
            })} ${game.id}`,
            timestamp: Date.now(),
            url: getTransactionScannerUrl(chainId, hash),
            urlCaption: formatMessage({
              id: 'coinLeague.viewTransaction',
              defaultMessage: 'View Transaction',
            }),
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

        onEndGameCallback({
          onConfirmation: onConfirmTx,
          onError: onCallbackError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [
      game,
      onEndGameCallback,
      chainId,
      createNotification,
      onError,
      onConfirm,
      formatMessage,
      enqueueSnackbar,
      handleViewTransaction,
    ],
  );

  return {reset, end, transactionHash, isLoading, confirmed, error};
}
