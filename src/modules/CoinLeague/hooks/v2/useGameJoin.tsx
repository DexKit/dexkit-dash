import React from 'react';
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
import IntlMessages from '@crema/utility/IntlMessages';

export function useGameJoin({
  game,
  onConfirm,
}: {
  game?: Game;
  onConfirm?: () => void;
}) {
  const {getScannerUrl} = useChainInfo();

  const [isLoading, setIsLoading] = useState(false);
  const {formatMessage} = useIntl();
  const [error, setError] = useState<Error>();
  const [transactionHash, setTransactionHash] = useState<string>();
  const [confirmed, setConfirmed] = useState<boolean>();

  const {enqueueSnackbar} = useSnackbar();

  const {chainId} = useLeaguesChainInfo();

  const {createNotification} = useNotifications();

  const {onJoinGameCallback} = useCoinLeaguesCallbacks(game?.address);

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

  const join = useCallback(
    (
      coins: string[],
      amount: string,
      capitainCoin: string,
      isNFTGame: boolean,
      affiliate?: any,
      championId?: any,
    ) => {
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
            title: isNFTGame
              ? ''
              : (formatMessage({
                  id: 'coinLeague.joinGame',
                  defaultMessage: 'Join Game',
                }) as string), // isNFTGame
            body: `${formatMessage({
              id: 'coinLeague.joiningGame',
              defaultMessage: 'Joining Game',
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

        const onError = (error: Error) => {
          setError(error);
          setIsLoading(false);
        };

        onJoinGameCallback(
          coins,
          amount,
          capitainCoin,
          {
            onConfirmation: onConfirmTx,
            onError,
            onSubmit: onSubmitTx,
          },
          affiliate,
          championId,
        );
      }
    },
    [
      game,
      onJoinGameCallback,
      chainId,
      createNotification,
      enqueueSnackbar,
      onConfirm,
      formatMessage,
      handleViewTransaction,
    ],
  );

  return {isLoading, reset, join, transactionHash, confirmed, error};
}
