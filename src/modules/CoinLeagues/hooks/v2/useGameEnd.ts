import {useCallback, useState} from 'react';
import {Game} from 'types/coinsleague';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useCoinLeaguesCallbacks} from '../useCoinLeagues';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {useNotifications} from 'hooks/useNotifications';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {useIntl} from 'react-intl';

export function useGameEnd({
  game,
  onError,
}: {
  game?: Game;
  onError?: (error: Error) => void;
}) {
  const {messages} = useIntl();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();
  const [confirmed, setConfirmed] = useState<boolean>();

  const {chainId} = useLeaguesChainInfo();

  const {createNotification} = useNotifications();

  const {onEndGameCallback} = useCoinLeaguesCallbacks(game?.address);

  const reset = useCallback(() => {
    setTransactionHash(undefined);
    setConfirmed(undefined);
    setError(undefined);
  }, []);

  const end = useCallback(
    (ev: any) => {
      if (game?.amount_to_play && chainId) {
        const onSubmitTx = (hash: string) => {
          setIsLoading(true);
          setTransactionHash(hash);

          createNotification({
            title: messages['coinLeague.endGame'] as string,
            body: `${messages['coinLeague.endingGame'] as string} ${game.id}`,
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
    [game, onEndGameCallback, chainId, createNotification, onError],
  );

  return {reset, end, transactionHash, isLoading, confirmed, error};
}
