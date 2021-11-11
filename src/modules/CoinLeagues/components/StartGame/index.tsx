import React, {useCallback, useMemo, useState} from 'react';

import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import {useCoinLeagues} from 'modules/CoinLeagues/hooks/useCoinLeagues';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {SubmitState} from '../ButtonState';
import Button from '@material-ui/core/Button';
import {useWeb3} from 'hooks/useWeb3';
import {
  ExplorerURL,
  IS_SUPPORTED_LEAGUES_CHAIN_ID,
} from 'modules/CoinLeagues/utils/constants';
import {ChainId} from 'types/blockchain';

interface Props {
  address?: string;
}

export const StartGame = (props: Props) => {
  const {address} = props;
  const {chainId} = useWeb3();
  const { game} =
    useCoinLeagues(address);
  const [tx, _setTx] = useState<string>();
  const [submitState, _setSubmitState] = useState<SubmitState>(SubmitState.None);
  /*const [submitAbortState, setSubmitAbortState] = useState<SubmitState>(
    SubmitState.None,
  );*/
  const goToExplorer = useCallback(
    (_ev: any) => {
      if (chainId === ChainId.Mumbai || chainId === ChainId.Matic) {
        window.open(`${ExplorerURL[chainId]}${tx}`);
      }
    },
    [tx, chainId],
  );

 /* const onStartGame = useCallback(
    (ev: any) => {
      if (game?.amount_to_play) {
        setSubmitState(SubmitState.WaitingWallet);
        const onSubmitTx = (tx: string) => {
          setTx(tx);
          setSubmitState(SubmitState.Submitted);
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
    [game, refetch],
  );
  const onAbortGame = useCallback(
    (ev: any) => {
      if (game?.amount_to_play) {
        setSubmitAbortState(SubmitState.WaitingWallet);
        const onSubmitTx = (tx: string) => {
          setTx(tx);
          setSubmitAbortState(SubmitState.Submitted);
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
    [game, refetch],
  );*/

  const abortTimestamp = useMemo(() => {
    if (game?.abort_timestamp.toNumber()) {
      return game?.abort_timestamp.toNumber() * 1000;
    }
  }, [game]);

  const started = useMemo(() => game?.started, [game]);
  const totalPlayers = useMemo(() => game?.num_players.toNumber(), [game]);
  const currentPlayers = useMemo(() => game?.players.length, [game]);
  const gameFull = useMemo(() => {
    if (totalPlayers && currentPlayers) {
      return totalPlayers === currentPlayers;
    }
  }, [started, totalPlayers, currentPlayers]);
  const canAbort = useMemo(
    () =>
      !game?.started &&
      !gameFull &&
      abortTimestamp &&
      new Date().getTime() > abortTimestamp,
    [game, abortTimestamp, gameFull],
  );

  return (
    <Paper>
      <Box m={2}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={9}>
            {!gameFull && (
              <Typography variant='h6' style={{margin: 5}}>
                <IntlMessages id='app.coinLeagues.waitingPlayers' />
              </Typography>
            )}
            <Typography variant='h6' style={{margin: 5}}>
              {currentPlayers} / {totalPlayers}
            </Typography>
            {gameFull && (
              <Typography variant='h6' style={{margin: 5}}>
                <IntlMessages id='app.coinLeagues.everybodyIsHere' />
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
                        {submitState === SubmitState.Submitted ? (
                          <IntlMessages id='app.coinLeagues.submittedTx' />
                        ) : submitState === SubmitState.Error ? (
                          <IntlMessages id='app.coinLeagues.txError' />
                        ) : submitState === SubmitState.Confirmed ? (
                          <IntlMessages id='app.coinLeagues.confirmedTx' />
                        ) : (
                          ''
                        )}
                      </Button>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={12}>
                  {/*  <Button
                    disabled={!gameFull || submitState !== SubmitState.None || !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId)}
                  <Button
                    disabled={
                      !gameFull ||
                      submitState !== SubmitState.None ||
                      !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId)
                    }
                    onClick={onStartGame}
                    fullWidth
                    variant={'contained'}
                    color={
                      submitState === SubmitState.Error ? 'default' : 'primary'
                    }>
                    <ButtonState
                      state={submitState}
                      defaultMsg={'Start Game'}
                      confirmedMsg={'Game Started'}
                      defaultMsg={
                        messages['app.coinLeagues.startGame'] as string
                      }
                      confirmedMsg={
                        messages['app.coinLeagues.gameStarted'] as string
                      }
                    />
                  </Button>*/}
                  {gameFull && (
                    <Paper>
                      <Box display={'flex'} justifyContent={'center'} p={2}>
                        <Typography>
                          &nbsp; Game will auto start soon
                        </Typography>
                      </Box>
                    </Paper>
                  )}
                </Grid>
                {/*canAbort && (
                  <Grid item xs={12} md={12}>
                    <Button
                      disabled={
                        !canAbort || submitAbortState !== SubmitState.None || !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId)
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
                    )*/}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
