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
import PlayGameDialog from 'modules/SquidLeague/components/dialogs/PlayGameDialog';
import {useToggler} from 'hooks/useToggler';

import JoinGameDialog from 'modules/SquidLeague/components/dialogs/JoinGameDialog';
import StartGameDialog from 'modules/SquidLeague/components/dialogs/StartGameDialog';
import EndGameDialog from 'modules/SquidLeague/components/dialogs/EndGameDialog';
import SetupGameDialog from 'modules/SquidLeague/components/dialogs/SetupGameDialog';
import {useGameAddress} from 'modules/SquidLeague/hooks/useGameAddress';
import {useOnChainGameData} from 'modules/SquidLeague/hooks/useOnChainGameData';
import {useOnChainCurrentRoundGame} from 'modules/SquidLeague/hooks/useOnChainCurrentRoundGame';

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
  const gameAddressQuery = useGameAddress(id);
  const gameDataQuery = useOnChainGameData(gameAddressQuery.data);
  const gameDataRoundQuery = useOnChainCurrentRoundGame(
    gameDataQuery.data?.round,
    gameAddressQuery.data,
  );
  const playGameToggler = useToggler(false);
  const joinGameToggler = useToggler(false);
  const setupGameToggler = useToggler(false);
  const startGameToggler = useToggler(false);
  const endGameToggler = useToggler(false);
  const [userPlay, setUserPlay] = useState(false);
  const {formatMessage} = useIntl();

  const classes = useStyles();

  const handleClosePlayGameDialog = useCallback(() => {
    playGameToggler.toggle();
    setUserPlay(false);
  }, [playGameToggler]);

  const openPlayModal = useCallback(
    (play: boolean) => {
      playGameToggler.toggle();
      setUserPlay(play);
    },
    [playGameToggler],
  );

  const handleCloseStartGameDialog = useCallback(() => {
    startGameToggler.toggle();
  }, [startGameToggler]);

  const handleCloseEndGameDialog = useCallback(() => {
    endGameToggler.toggle();
  }, [endGameToggler]);

  const handleCloseSetupGameDialog = useCallback(() => {
    setupGameToggler.toggle();
  }, [setupGameToggler]);

  const handleCloseJoinGameDialog = useCallback(() => {
    joinGameToggler.toggle();
  }, [joinGameToggler]);

  return (
    <MainLayout>
      {gameAddressQuery.data && (
        <PlayGameDialog
          play={userPlay}
          gameAddress={gameAddressQuery.data}
          dialogProps={{
            open: playGameToggler.show,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleClosePlayGameDialog,
          }}
        />
      )}
      {gameAddressQuery.data && (
        <JoinGameDialog
          gameAddress={gameAddressQuery.data}
          dialogProps={{
            open: joinGameToggler.show,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseJoinGameDialog,
          }}
        />
      )}
      {gameAddressQuery.data && (
        <StartGameDialog
          gameAddress={gameAddressQuery.data}
          dialogProps={{
            open: startGameToggler.show,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseStartGameDialog,
          }}
        />
      )}
      {gameAddressQuery.data && (
        <EndGameDialog
          gameAddress={gameAddressQuery.data}
          dialogProps={{
            open: endGameToggler.show,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseEndGameDialog,
          }}
        />
      )}
      {gameAddressQuery.data && (
        <SetupGameDialog
          gameAddress={gameAddressQuery.data}
          dialogProps={{
            open: setupGameToggler.show,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseSetupGameDialog,
          }}
        />
      )}
      <Grid container spacing={4}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <Typography color='textPrimary' variant='subtitle1'>
            <IntlMessages
              id='squidLeague.gameInformation'
              defaultMessage={'Squid League'}
            />{' '}
            #{id}
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
                  {gameDataQuery.data?.round.toNumber()}
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
                                  {gameDataRoundQuery.data?.start_timestamp.toString()}
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
                                  {gameDataRoundQuery.data?.duration?.toString()}
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
                          <Grid item xs={4}>
                            <Button
                              fullWidth
                              startIcon={<ArrowDownwardIcon />}
                              variant='outlined'
                              onClick={() => startGameToggler.toggle()}
                              color='primary'>
                              <IntlMessages
                                id='squidLeague.startGame'
                                defaultMessage={'Start Game'}
                              />
                            </Button>
                          </Grid>
                          <Grid item xs={4}>
                            <Button
                              fullWidth
                              onClick={() => endGameToggler.toggle()}
                              startIcon={<ArrowDownwardIcon />}
                              variant='outlined'
                              color='primary'>
                              <IntlMessages
                                id='squidLeague.endGame'
                                defaultMessage={'End Game'}
                              />
                            </Button>
                          </Grid>
                          <Grid item xs={4}>
                            <Button
                              fullWidth
                              onClick={() => setupGameToggler.toggle()}
                              startIcon={<ArrowDownwardIcon />}
                              variant='outlined'
                              color='primary'>
                              <IntlMessages
                                id='squidLeague.setupGame'
                                defaultMessage={'Setup Game'}
                              />
                            </Button>
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              fullWidth
                              startIcon={<ArrowDownwardIcon />}
                              variant='outlined'
                              onClick={() => joinGameToggler.toggle()}
                              color='primary'>
                              <IntlMessages
                                id='squidLeague.joinGame'
                                defaultMessage={'Join Game'}
                              />
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
                                  {gameDataRoundQuery.data?.start_price.toString()}{' '}
                                  USD
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
                                  {gameDataRoundQuery.data?.end_price.toString()}{' '}
                                  USD
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
            {gameDataRoundQuery.data?.total_players.toString()}
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
