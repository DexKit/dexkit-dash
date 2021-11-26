import React, {useCallback, useState, useMemo} from 'react';
import {
  useCoinLeagues,
  useCoinLeaguesCallbacks,
} from 'modules/CoinLeagues/hooks/useCoinLeagues';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {ButtonState, SubmitState} from '../ButtonState';
import Button from '@material-ui/core/Button';
import {useWeb3} from 'hooks/useWeb3';
import {
  ExplorerURL,
  IS_SUPPORTED_LEAGUES_CHAIN_ID,
} from 'modules/CoinLeagues/utils/constants';
import {useInterval} from 'hooks/utils/useInterval';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import { useNotifications } from 'hooks/useNotifications';
interface Props {
  id?: string;
}

export const StartGame = (props: Props) => {
  const {id} = props;
  const {chainId} = useWeb3();
  const {game, refetch} = useCoinLeagues(id);
  const {createNotification} = useNotifications();
  const [tx, setTx] = useState<string>();
  const [actualTimestamp, setActualTimestamp] = useState<number>(
    new Date().getTime(),
  );
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const [submitAbortState, setSubmitAbortState] = useState<SubmitState>(
    SubmitState.None,
  );

  const {onStartGameCallback, onAbortGameCallback} = useCoinLeaguesCallbacks(
    game?.address,
  );

  const goToExplorer = useCallback(
    (_ev: any) => {
      if (chainId && IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId)) {
        //@ts-ignore
        window.open(`${ExplorerURL[chainId]}${tx}`);
      }
    },
    [tx, chainId],
  );

  const onStartGame = useCallback(
    (ev: any) => {
      if (game?.amount_to_play && chainId) {
        setSubmitState(SubmitState.WaitingWallet);
        const onSubmitTx = (tx: string) => {
          setTx(tx);
          setSubmitState(SubmitState.Submitted);
          createNotification({
            title: 'Started Game',
            body: `Started Game ${id}`,
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
        };
        const onError = () => {
          setSubmitState(SubmitState.Error);
          setTimeout(() => {
            setSubmitState(SubmitState.None);
          }, 3000);
        };

        onStartGameCallback({
          onConfirmation: onConfirmTx,
          onError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [game, refetch, onStartGameCallback, chainId, createNotification, id],
  );
  const onAbortGame = useCallback(
    (ev: any) => {
      if (game?.amount_to_play && chainId) {
        setSubmitAbortState(SubmitState.WaitingWallet);
        const onSubmitTx = (tx: string) => {
          setTx(tx);
          setSubmitAbortState(SubmitState.Submitted);
          createNotification({
            title: 'Aborted Game',
            body: `Aborted Game ${id}`,
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
          setSubmitAbortState(SubmitState.Confirmed);
          refetch();
        };
        const onError = () => {
          setSubmitAbortState(SubmitState.Error);
          setTimeout(() => {
            setSubmitAbortState(SubmitState.None);
          }, 3000);
        };

        onAbortGameCallback({
          onConfirmation: onConfirmTx,
          onError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [game, refetch, onAbortGameCallback, chainId, createNotification, id],
  );

  const abortTimestamp = useMemo(() => {
    if (game?.abort_timestamp.toNumber()) {
      return game?.abort_timestamp.toNumber() * 1000;
    }
  }, [game, game?.abort_timestamp]);

  const startTimestamp = useMemo(() => {
    if (game?.start_timestamp.toNumber()) {
      return game?.start_timestamp.toNumber() * 1000;
    }
  }, [game, game?.start_timestamp]);

  const started = useMemo(() => game?.started, [game]);
  const aborted = useMemo(() => game?.aborted, [game]);
  const totalPlayers = useMemo(() => game?.num_players.toNumber(), [game]);
  const currentPlayers = useMemo(() => game?.players.length, [game]);
  const gameFull = useMemo(() => {
    if (totalPlayers && currentPlayers) {
      return totalPlayers === currentPlayers;
    }
  }, [totalPlayers, currentPlayers]);

  useInterval(() => {
    setActualTimestamp(new Date().getTime());
  }, 1000);

  const gameCanStart = useMemo(() => {
    if (currentPlayers && startTimestamp) {
      return currentPlayers > 1 && actualTimestamp > startTimestamp && !started;
    }
  }, [startTimestamp, currentPlayers, actualTimestamp, started]);

  const canAbort = useMemo(
    () =>
      !started &&
      !gameFull &&
      abortTimestamp &&
      new Date().getTime() > abortTimestamp,
    [started, abortTimestamp, gameFull],
  );

  return (
    <Paper>
      <Box m={2}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={9}>
            {!gameFull && (
              <Typography variant='h6' style={{margin: 5}}>
                Waiting For Players
              </Typography>
            )}
            <Typography variant='h6' style={{margin: 5}}>
              {currentPlayers} / {totalPlayers}
            </Typography>
            {gameFull && (
              <Typography variant='h6' style={{margin: 5}}>
                Everybody is here
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <Box m={2}>
              <Grid
                container
                justifyContent={'center'}
                alignContent={'center'}
                spacing={2}
                alignItems={'center'}>
                <Grid item xs={12} md={12}>
                  <Box display={'flex'} justifyContent={'center'}>
                    {tx && (
                      <Button variant={'text'} onClick={goToExplorer}>
                        {submitState === SubmitState.Submitted
                          ? 'Submitted Tx'
                          : submitState === SubmitState.Error
                          ? 'Tx Error'
                          : submitState === SubmitState.Confirmed
                          ? 'Confirmed Tx'
                          : ''}
                      </Button>
                    )}
                  </Box>
                </Grid>

                {!aborted && (
                  <Grid item xs={12} md={12}>
                    <Button
                      disabled={
                        !gameCanStart ||
                        submitState !== SubmitState.None ||
                        !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId)
                      }
                      onClick={onStartGame}
                      fullWidth
                      variant={'contained'}
                      color={
                        submitState === SubmitState.Error
                          ? 'default'
                          : 'primary'
                      }>
                      <ButtonState
                        state={submitState}
                        defaultMsg={'Start Game'}
                        confirmedMsg={'Game Started'}
                      />
                    </Button>
                    {gameCanStart && (
                      <Paper>
                        <Box display={'flex'} justifyContent={'center'} p={2}>
                          <Typography>
                            &nbsp; Game will auto start soon, if not you can
                            manually start it
                          </Typography>
                        </Box>
                      </Paper>
                    )}
                  </Grid>
                )}
                {canAbort && (
                  <Grid item xs={12} md={12}>
                    <Button
                      disabled={
                        !canAbort ||
                        submitAbortState !== SubmitState.None ||
                        !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) ||
                        aborted
                      }
                      onClick={onAbortGame}
                      variant={'contained'}
                      fullWidth
                      color={
                        submitAbortState === SubmitState.Error
                          ? 'default'
                          : 'secondary'
                      }>
                      <ButtonState
                        state={submitAbortState}
                        defaultMsg={'ABORT GAME'}
                        confirmedMsg={'Game Aborted'}
                      />
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
