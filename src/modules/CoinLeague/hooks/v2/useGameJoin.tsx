import React from 'react';
import {useCallback, useState} from 'react';
import {Game} from 'types/coinleague';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {useNotifications} from 'hooks/useNotifications';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {useIntl} from 'react-intl';
import {useSnackbar} from 'notistack';
import {Button} from '@material-ui/core';
import {useChainInfo} from 'hooks/useChainInfo';
import IntlMessages from '@crema/utility/IntlMessages';
import {useCoinLeagueV3Callbacks} from '../useCoinLeagueFactoryV3';
import {CoinToPlayInterface} from 'modules/CoinLeague/constants';

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

  const {onJoinGameCallback, onApproveTokenCallback} = useCoinLeagueV3Callbacks(
    game?.id?.toString(),
  );

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
      captainCoin: string,
      isNFTGame: boolean,
      affiliate?: string | null,
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
          captainCoin,
          {
            onConfirmation: onConfirmTx,
            onError,
            onSubmit: onSubmitTx,
          },
          affiliate,
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

  const approveToken = useCallback(
    (coinToApprove: CoinToPlayInterface, onConfirmApprove: any) => {
      if (game && chainId) {
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
            title: formatMessage(
              {
                id: 'allowing.token',
                defaultMessage: 'Allowing {symbol}',
              },
              {symbol: coinToApprove.symbol},
            ) as string, // isNFTGame
            body: `${formatMessage(
              {
                id: 'allowing.token.to.spend',
                defaultMessage: 'Allowing {symbol} to be used on game',
              },
              {symbol: coinToApprove.symbol},
            )} ${game.id}`,
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
          onConfirmApprove();
        };

        const onError = (error: Error) => {
          setError(error);
          setIsLoading(false);
        };

        onApproveTokenCallback(coinToApprove.address, {
          onConfirmation: onConfirmTx,
          onError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [
      game,
      chainId,
      createNotification,
      enqueueSnackbar,
      onConfirm,
      formatMessage,
      handleViewTransaction,
      onApproveTokenCallback,
    ],
  );

  return {
    isLoading,
    reset,
    join,
    approveToken,
    transactionHash,
    confirmed,
    error,
  };
}
