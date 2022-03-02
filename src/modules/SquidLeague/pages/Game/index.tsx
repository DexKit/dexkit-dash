import React, {useCallback, useState} from 'react';
import MainLayout from 'shared/components/layouts/main';

import {
  Paper,
  Box,
  Grid,
  Typography,
  TextField,
  Divider,
  Button,
  makeStyles,
} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {useParams} from 'react-router';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import {useChainInfo} from 'hooks/useChainInfo';
import {useSquidGameCallbacks} from 'modules/SquidLeague/hooks/useSquidGameCallbacks';
import PlayGameDialog from 'modules/SquidLeague/components/dialogs/PlayGameDialog';
import {useToggler} from 'hooks/useToggler';
import {useWeb3} from 'hooks/useWeb3';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useNotifications} from 'hooks/useNotifications';

interface Params {
  id: string;
}

const useStyles = makeStyles((theme) => ({
  coinImage: {
    borderRadius: '50%',
    width: theme.spacing(24),
    height: theme.spacing(24),
  },
}));

export const Game = () => {
  const {id} = useParams<Params>();
  const {onPlayChallengeCallback} = useSquidGameCallbacks(id);
  const {chainId} = useWeb3();
  const playGameToggler = useToggler(false);
  const [confirmedPlayGame, setConfirmedPlayGame] = useState(false);
  const [userPlay, setUserPlay] = useState(false);
  const [transaction, setTransaction] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingPlayingGame, setLoadingPlayingGame] = useState(false);
  const {getTransactionScannerUrl} = useChainInfo();
  const {createNotification} = useNotifications();

  const {formatMessage} = useIntl();

  const classes = useStyles();

  const handleClosePlayGameDialog = useCallback(() => {
    playGameToggler.toggle();
  }, [playGameToggler]);

  const onConfirmPlayGameCallback = useCallback(() => {
    if (!chainId) {
      return;
    }

    setLoadingPlayingGame(true);
    const onConfirm = () => {
      setLoadingPlayingGame(false);
      setConfirmedPlayGame(true);
    };
    const onSubmit = (tx: string) => {
      setTransaction(tx);
      createNotification({
        title: formatMessage({
          id: 'squidLeague.createGameTitle',
          defaultMessage: `Played game on squid`,
        }),
        body: formatMessage({
          id: 'squidLeague.createGameBody',
          defaultMessage: `Played game on squid`,
        }),
        timestamp: Date.now(),
        url: getTransactionScannerUrl(chainId, tx),
        urlCaption: formatMessage({
          id: 'squidLeague.viewTx',
          defaultMessage: 'View Tx',
        }),
        type: NotificationType.TRANSACTION,
        metadata: {
          chainId: chainId,
          transactionHash: tx,
          status: 'pending',
        } as TxNotificationMetadata,
      });
    };
    const onError = (error: any) => {
      setLoadingPlayingGame(false);
      setErrorMessage(error);
    };

    onPlayChallengeCallback(userPlay, {
      onConfirmation: onConfirm,
      onSubmit: onSubmit,
      onError,
    });
  }, [
    getTransactionScannerUrl,
    chainId,
    userPlay,

    createNotification,
    onPlayChallengeCallback,
    formatMessage,
  ]);

  const openPlayModal = useCallback(
    (play: boolean) => {
      playGameToggler.toggle();
      setUserPlay(play);
    },
    [playGameToggler],
  );

  return (
    <MainLayout>
      <PlayGameDialog
        errorMessage={errorMessage}
        transactionHash={transaction}
        loading={loadingPlayingGame}
        confirmed={confirmedPlayGame}
        onConfirm={onConfirmPlayGameCallback}
        dialogProps={{
          open: playGameToggler.show,
          onClose: handleClosePlayGameDialog,
        }}
      />
      <Grid container spacing={4}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <Typography color='textPrimary' variant='subtitle1'>
            <IntlMessages
              id='squidLeague.gameInformation'
              defaultMessage={'Squid League'}
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textPrimary' variant='subtitle1'>
            <IntlMessages id='squidLeague.battle' defaultMessage={'Battle'} />
          </Typography>
          <Typography color='textSecondary' variant='body1'>
            <IntlMessages
              id='squidLeague.guessIfTheCoinWillGoUpOrDown'
              defaultMessage={
                'Be a prediction wizard and guess if coin will go up or down'
              }
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box p={4} component={Paper}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography color='textPrimary' variant='subtitle1'>
                  <IntlMessages
                    id='squidLeague.round'
                    defaultMessage={'Round'}
                  />{' '}
                  01
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={4}
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'>
                  <Grid item xs={12} sm={4}>
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <Paper variant='outlined'>
                          <Box p={2}>
                            <Box
                              display='flex'
                              justifyContent='space-between'
                              alignItems='center'
                              alignContent='center'>
                              <Box>
                                <Typography
                                  color='textSecondary'
                                  variant='caption'>
                                  <IntlMessages
                                    id='squidLeague.gameStartsIn'
                                    defaultMessage={'Game starts in'}
                                  />
                                </Typography>
                                <Typography variant='h5' color='textPrimary'>
                                  10:34:02
                                </Typography>
                              </Box>
                              <Box>Icon</Box>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper variant='outlined'>
                          <Box p={2}>
                            <Box
                              display='flex'
                              justifyContent='space-between'
                              alignItems='center'
                              alignContent='center'>
                              <Box>
                                <Typography
                                  color='textSecondary'
                                  variant='caption'>
                                  <IntlMessages
                                    id='squidLeague.countDown'
                                    defaultMessage={'Countdown'}
                                  />
                                </Typography>
                                <Typography variant='h5' color='textPrimary'>
                                  11:23
                                </Typography>
                              </Box>
                              <Box>Icon</Box>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <Paper variant='outlined'>
                              <Box p={4}>
                                <Grid
                                  container
                                  direction='column'
                                  justifyContent='center'
                                  alignItems='center'
                                  alignContent='center'
                                  spacing={4}>
                                  <Grid item>
                                    <img
                                      src=''
                                      alt=''
                                      className={classes.coinImage}
                                    />
                                  </Grid>
                                  <Grid item>
                                    <Typography
                                      variant='subtitle1'
                                      color='textPrimary'>
                                      COIN NAME
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Paper>
                          </Grid>
                          <Grid item xs={12}>
                            <IntlMessages
                              id='squidLeague.thisWillGoUpOrDown'
                              defaultMessage={'Guess if coin goes up or down'}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              fullWidth
                              startIcon={<ArrowUpwardIcon />}
                              variant='contained'
                              onClick={() => openPlayModal(true)}
                              color='primary'>
                              <IntlMessages
                                id='squidLeague.up'
                                defaultMessage={'Up'}
                              />
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              fullWidth
                              startIcon={<ArrowDownwardIcon />}
                              variant='outlined'
                              onClick={() => openPlayModal(false)}
                              color='primary'>
                              <IntlMessages
                                id='squidLeague.down'
                                defaultMessage={'Down'}
                              />
                            </Button>
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              disabled
                              fullWidth
                              startIcon={<ArrowDownwardIcon />}
                              variant='outlined'
                              color='primary'>
                              <IntlMessages id='squidLeague.down' />
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='subtitle1' color='textPrimary'>
                          <IntlMessages
                            id='squidLeague.trackTheCurrency'
                            defaultMessage={'Track Currency'}
                          />
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Paper variant='outlined'>
                              <Box
                                p={2}
                                display='flex'
                                alignItems='center'
                                alignContent='center'
                                justifyContent='space-between'>
                                <Typography variant='body1' color='textPrimary'>
                                  0.00 USD
                                </Typography>
                                <Typography
                                  variant='body1'
                                  color='textSecondary'>
                                  <IntlMessages
                                    id='squidLeague.initialPrice'
                                    defaultMessage={'Initial Price'}
                                  />
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                          <Grid item xs={12}>
                            <Paper variant='outlined'>
                              <Box
                                p={2}
                                display='flex'
                                alignItems='center'
                                alignContent='center'
                                justifyContent='space-between'>
                                <Typography variant='body1' color='textPrimary'>
                                  0.00 USD
                                </Typography>
                                <Typography
                                  variant='body1'
                                  color='textSecondary'>
                                  <IntlMessages
                                    id='squidLeague.currentPrice'
                                    defaultMessage={'Current Price'}
                                  />
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <Paper variant='outlined'>
                              <Box p={2}>
                                <Box
                                  display='flex'
                                  justifyContent='space-between'
                                  alignItems='center'
                                  alignContent='center'>
                                  <Box>
                                    <Typography
                                      color='textSecondary'
                                      variant='caption'>
                                      <IntlMessages
                                        id='squidLeague.nextRound'
                                        defaultMessage={'Next Round'}
                                      />
                                    </Typography>
                                    <Typography
                                      variant='h5'
                                      color='textPrimary'>
                                      11:23
                                    </Typography>
                                  </Box>
                                  <Box>Icon</Box>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant='body1' color='textSecondary'>
                              <IntlMessages
                                id='squidGame.waitForTheNextGame'
                                defaultMessage={'Wait for next game'}
                              />
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='subtitle1' color='textPrimary'>
            <IntlMessages
              id='squidLeague.shareGame'
              defaultMessage={'Share game'}
            />
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            <IntlMessages
              id='squidLeague.shareYourGameWithAnotherPlayers'
              defaultMessage={'Share game with another players'}
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={formatMessage({
              id: 'squidLeague.url',
              defaultMessage: 'url',
            })}
            variant='outlined'
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='subtitle1' color='textPrimary'>
            <IntlMessages id='squidLeague.players' defaultMessage={'Players'} />{' '}
            (1.2)
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            <IntlMessages
              id='squidLeague.pointsAreCountedHourly'
              defaultMessage={'Points are counted hourly'}
            />
          </Typography>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Game;
