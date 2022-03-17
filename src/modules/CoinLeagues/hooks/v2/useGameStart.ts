import {useCallback, useState} from 'react';
import {Game} from 'types/coinsleague';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useCoinLeaguesCallbacks} from '../useCoinLeagues';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {useNotifications} from 'hooks/useNotifications';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {useIntl} from 'react-intl';

export function useGameStart(game?: Game) {
  const {messages} = useIntl();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();
  const [confirmed, setConfirmed] = useState<boolean>();

  const {chainId} = useLeaguesChainInfo();

  const {createNotification} = useNotifications();

  const {onStartGameCallback} = useCoinLeaguesCallbacks(game?.address);

  const reset = useCallback(() => {
    setTransactionHash(undefined);
    setConfirmed(undefined);
    setError(undefined);
  }, []);

  const start = useCallback(
    (ev: any) => {
      if (game?.amount_to_play && chainId) {
        const onSubmitTx = (hash: string) => {
          setIsLoading(true);
          setTransactionHash(hash);

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
          setConfirmed(true);
          setIsLoading(false);
        };

        const onError = (error: Error) => {
          setError(error);
          setIsLoading(false);
        };

        onStartGameCallback({
          onConfirmation: onConfirmTx,
          onError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [game, onStartGameCallback, chainId, createNotification],
  );

  return {reset, start, transactionHash, isLoading, confirmed, error};
}
