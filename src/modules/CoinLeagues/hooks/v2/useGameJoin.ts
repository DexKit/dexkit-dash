import {useCallback, useState} from 'react';
import {Game} from 'types/coinsleague';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useCoinLeaguesCallbacks} from '../useCoinLeagues';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {useNotifications} from 'hooks/useNotifications';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {useIntl} from 'react-intl';

export function useGameJoin({
  game,
  onConfirm,
}: {
  game?: Game;
  onConfirm?: () => void;
}) {
  const {messages} = useIntl();
  const [error, setError] = useState<Error>();
  const [transactionHash, setTransactionHash] = useState<string>();
  const [confirmed, setConfirmed] = useState<boolean>();

  const {chainId} = useLeaguesChainInfo();

  const {createNotification} = useNotifications();

  const {onJoinGameCallback} = useCoinLeaguesCallbacks(game?.address);

  const reset = useCallback(() => {
    setTransactionHash(undefined);
    setConfirmed(undefined);
    setError(undefined);
  }, []);

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
        const onSubmitTx = (hash: string) => {
          setTransactionHash(hash);

          createNotification({
            title: isNFTGame ? '' : (messages['coinLeague.joinGame'] as string), // isNFTGame
            body: `${messages['coinLeague.joiningGame'] as string} ${game.id}`,
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
        };

        const onError = (error: Error) => {
          setError(error);
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
    [game, onJoinGameCallback, chainId, createNotification, onConfirm],
  );

  return {reset, join, transactionHash, confirmed, error};
}
