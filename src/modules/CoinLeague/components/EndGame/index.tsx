import React, {useCallback, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {
  useCoinLeagues,
  useCoinLeaguesCallbacks,
} from 'modules/CoinLeague/hooks/useCoinLeagues';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import {ButtonState, SubmitState} from '../ButtonState';
import Button from '@material-ui/core/Button';
import {
  ExplorerURL,
  IS_SUPPORTED_LEAGUES_CHAIN_ID,
} from 'modules/CoinLeague/utils/constants';
import Typography from '@material-ui/core/Typography';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useNotifications} from 'hooks/useNotifications';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import IntlMessages from '@crema/utility/IntlMessages';

interface Props {
  id?: string;
}

export const EndGameButton: React.FC<Props> = ({id}) => {
  const {chainId} = useLeaguesChainInfo();
  const {game, refetch, refetchWinner} = useCoinLeagues(id);
  const [tx, setTx] = useState<string>();
  const {createNotification} = useNotifications();
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const {onEndGameCallback} = useCoinLeaguesCallbacks(game?.address);

  const goToExplorer = useCallback(
    (_ev: any) => {
      if (chainId && IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId)) {
        // @ts-ignore
        window.open(`${ExplorerURL[chainId]}${tx}`);
      }
    },
    [tx, chainId],
  );

  const {messages} = useIntl();

  const startTimestamp = game?.start_timestamp;
  const durationBN = game?.duration;

  const canEndGame = useMemo(() => {
    if (startTimestamp && durationBN) {
      const start = startTimestamp.toNumber() * 1000;
      const duration = durationBN.toNumber() * 1000;
      return new Date().getTime() > start + duration;
    }
  }, [startTimestamp, durationBN]);

  const onEndGame = useCallback(
    (ev: any) => {
      if (game?.amount_to_play && chainId) {
        setSubmitState(SubmitState.WaitingWallet);
        const onSubmitTx = (tx: string) => {
          setTx(tx);
          setSubmitState(SubmitState.Submitted);
          createNotification({
            title: 'Ended Game',
            body: `Ended Game ${id}`,
            timestamp: Date.now(),
            url: getTransactionScannerUrl(chainId, tx),
            urlCaption: 'View transaction',
            type: NotificationType.TRANSACTION,
            metadata: {
              chainId: chainId,
              transactionHash: tx,
              status: 'pending',
            } as TxNotificationMetadata,
          });
        };
        const onConfirmTx = () => {
          setSubmitState(SubmitState.Confirmed);
          refetch();
          refetchWinner();
        };
        const onError = () => {
          setSubmitState(SubmitState.Error);
          setTimeout(() => {
            setSubmitState(SubmitState.None);
          }, 3000);
        };

        onEndGameCallback({
          onConfirmation: onConfirmTx,
          onError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [
      game,
      refetch,
      onEndGameCallback,
      chainId,
      createNotification,
      id,
      refetchWinner,
    ],
  );

  return (
    <Button
      onClick={onEndGame}
      fullWidth
      disabled={
        !canEndGame ||
        submitState !== SubmitState.None ||
        !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId)
      }
      variant='contained'
      color='primary'>
      <IntlMessages id='coinLeague.endGame' defaultMessage='End Game' />
    </Button>
  );
};

export default EndGameButton;
