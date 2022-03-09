import React, {useCallback, useMemo, useState} from 'react';
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
import {ethers} from 'ethers';
import {GameState} from 'modules/SquidLeague/utils/types';
import {JoinGameStateSkeleton} from './JoinGameState.skeleton';
import {ChainId} from 'types/blockchain';
import {MaticPriceFeeds} from 'modules/CoinLeagues/constants/PriceFeeds/matic';
import {MumbaiPriceFeeds} from 'modules/CoinLeagues/constants';
import {useWeb3} from 'hooks/useWeb3';
import Countdown from 'modules/SquidLeague/components/Countdown';
import WithdrawGameDialog from 'modules/SquidLeague/components/dialogs/WithdrawGameDialog';
import {convertUSDPriceUnit} from 'modules/SquidLeague/utils/format';

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

export const GameLayout = (props: Params) => {
  const {id} = props;
  const {chainId} = useWeb3();
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
  const withdrawGameToggler = useToggler(false);
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

  const handleCloseWithdrawGameDialog = useCallback(() => {
    withdrawGameToggler.toggle();
  }, [withdrawGameToggler]);

  const pot = gameDataQuery.data?.pot;

  const entry = useMemo(() => {
    if (pot) {
      return ethers.utils.formatEther(pot);
    } else {
      return null;
    }
  }, [pot]);

  const gameState = gameDataQuery.data?.gameState;
  const isPlayerJoined = gameDataQuery.data?.playerJoined;

  const isJoinGameState = useMemo(() => {
    return gameState === GameState.Joining;
  }, [gameState]);

  const isSetupGameState = useMemo(() => {
    return gameState === GameState.Setup;
  }, [gameState]);

  const isStartedGameState = useMemo(() => {
    return gameState === GameState.Started;
  }, [gameState]);

  const isFinishGameState = useMemo(() => {
    return gameState === GameState.Finished;
  }, [gameState]);
  const joinStartTimestamp = gameDataQuery.data?.startTimestamp;

  const startTimestampRound = gameDataRoundQuery.data?.start_timestamp;

  // Can we setup challenge
  const canWeSetupChallenge = useMemo(() => {
    if (isJoinGameState && joinStartTimestamp) {
      const actualDate = new Date();
      const gameDate = new Date(joinStartTimestamp.toNumber() * 1000);
      if (actualDate.getTime() > gameDate.getTime()) {
        return true;
      }
    }

    return false;
  }, [joinStartTimestamp, isJoinGameState]);

  const playerJoinedRound = gameDataRoundQuery.data?.playerJoinedCurrentRound;

  const durationTimestampRound = gameDataRoundQuery.data?.duration;

  const canWePlayChallenge = useMemo(() => {
    if (isPlayerJoined && isSetupGameState && !playerJoinedRound) {
      return true;
    }

    return false;
  }, [isSetupGameState, playerJoinedRound, isPlayerJoined]);

  const canWeEndGame = useMemo(() => {
    if (isStartedGameState && startTimestampRound && durationTimestampRound) {
      const actualDate = new Date();
      const startTimestampRoundDate = new Date(
        startTimestampRound?.toNumber() * 1000,
      );
      const durationTimestampRoundDate = new Date(
        durationTimestampRound?.toNumber() * 1000,
      );
      if (
        actualDate.getTime() >
        startTimestampRoundDate.getTime() + durationTimestampRoundDate.getTime()
      ) {
        return true;
      }
    }
    return false;
  }, [isStartedGameState, startTimestampRound, durationTimestampRound]);

  const canWeStartGame = useMemo(() => {
    if (isSetupGameState && startTimestampRound) {
      const actualDate = new Date();
      const startTimestampRoundDate = new Date(
        startTimestampRound?.toNumber() * 1000,
      );
      if (actualDate.getTime() > startTimestampRoundDate.getTime()) {
        return true;
      }
    }
    return false;
  }, [startTimestampRound, isSetupGameState]);

  const playerPlayCurrentRound =
    gameDataRoundQuery.data?.playerPlayCurrentRound;
  // User can play false or true, so we return undefined if user not played yet
  const playerPlayRound = useMemo(() => {
    if (playerJoinedRound) {
      return playerPlayCurrentRound || false;
    } else {
      return undefined;
    }
  }, [playerJoinedRound, playerPlayCurrentRound]);

  const coinFeed = gameDataRoundQuery.data?.feed;

  const coin = useMemo(() => {
    if (chainId && coinFeed) {
      if (chainId === ChainId.Matic) {
        return MaticPriceFeeds.find(
          (f) => f.address.toLowerCase() === coinFeed.toLowerCase(),
        );
      }
      if (chainId === ChainId.Mumbai) {
        return MumbaiPriceFeeds.find(
          (f) => f.address.toLowerCase() === coinFeed.toLowerCase(),
        );
      }
    }
  }, [chainId, coinFeed]);

  const playerChallengeResult =
    gameDataRoundQuery.data?.playerCurrentRoundChallengeResult;

  const lastChallengeTimestamp = gameDataQuery.data?.lastChallengeTimestamp;

  const startPrice = gameDataRoundQuery.data?.start_price;
  const currentPrice = gameDataRoundQuery.data?.feedPriceCurrentRound;

  const currentScore = useMemo(() => {
    if (startPrice && currentPrice) {
      return currentPrice.sub(startPrice).div(currentPrice);
    }
  }, [startPrice, currentPrice]);

  return (
    <MainLayout>
      {gameAddressQuery.data && (
        <PlayGameDialog
          play={userPlay}
          gameAddress={gameAddressQuery.data}
          onRefetchCallback={() => gameDataRoundQuery.refetch()}
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
          pot={pot}
          onRefetchCallback={() => gameDataQuery.refetch()}
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
          onRefetchCallback={() => gameDataQuery.refetch()}
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
          onRefetchCallback={() => gameDataQuery.refetch()}
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
          onRefetchCallback={() => gameDataQuery.refetch()}
          dialogProps={{
            open: setupGameToggler.show,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseSetupGameDialog,
          }}
        />
      )}
      {gameAddressQuery.data && (
        <WithdrawGameDialog
          gameAddress={gameAddressQuery.data}
          onRefetchCallback={() => gameDataQuery.refetch()}
          dialogProps={{
            open: withdrawGameToggler.show,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseWithdrawGameDialog,
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
            #{Number(id) + 1}
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
                'Be a prediction wizard and guess if coin will go up or down in an hour'
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
              {gameDataQuery?.isLoading && <JoinGameStateSkeleton />}

              {isJoinGameState && (
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
                                    {joinStartTimestamp && (
                                      <Countdown
                                        startTimestamp={joinStartTimestamp.toNumber()}
                                        onEndCallback={() =>
                                          gameDataRoundQuery.refetch()
                                        }
                                      />
                                    )}
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
                                      id='squidLeague.entry'
                                      defaultMessage={'Entry'}
                                    />
                                  </Typography>
                                  <Typography variant='h5' color='textPrimary'>
                                    {entry} MATIC
                                  </Typography>
                                </Box>
                                <Box>Icon</Box>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          {!gameDataQuery.data?.playerJoined && (
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
                          )}
                          {gameDataQuery.data?.playerJoined && (
                            <Box display={'flex'} justifyContent={'center'}>
                              <Typography variant={'h5'}> Joined</Typography>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              <Grid item xs={12}>
                <Grid
                  container
                  spacing={4}
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'>
                  <Grid item xs={12} sm={4}>
                    <Grid container spacing={4}>
                      {isSetupGameState && (
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
                                    {startTimestampRound && (
                                      <Countdown
                                        startTimestamp={startTimestampRound.toNumber()}
                                        onEndCallback={() =>
                                          gameDataRoundQuery.refetch()
                                        }
                                      />
                                    )}
                                  </Typography>
                                </Box>
                                <Box>Icon</Box>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      )}

                      {isStartedGameState && (
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
                                    {startTimestampRound &&
                                      durationTimestampRound && (
                                        <Countdown
                                          startTimestamp={startTimestampRound.toNumber()}
                                          duration={durationTimestampRound.toNumber()}
                                          onEndCallback={() =>
                                            gameDataRoundQuery.refetch()
                                          }
                                        />
                                      )}
                                  </Typography>
                                </Box>
                                <Box>Icon</Box>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      )}
                      {(isStartedGameState ||
                        isFinishGameState ||
                        isSetupGameState) &&
                        coin && (
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
                                          src={coin.logo}
                                          alt={coin.baseName}
                                          className={classes.coinImage}
                                        />
                                      </Grid>
                                      <Grid item>
                                        <Typography
                                          variant='subtitle1'
                                          color='textPrimary'>
                                          {coin.baseName.toUpperCase()}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Paper>
                              </Grid>

                              <Grid item xs={12}>
                                <IntlMessages
                                  id='squidLeague.thisWillGoUpOrDown'
                                  defaultMessage={
                                    'Predict if coin goes up or down'
                                  }
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Button
                                  fullWidth
                                  disabled={!canWePlayChallenge}
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
                                  disabled={!canWePlayChallenge}
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
                              {(playerPlayRound === false ||
                                playerPlayRound === true) && (
                                <Grid item xs={12}>
                                  <Box
                                    display={'flex'}
                                    justifyContent={'center'}>
                                    <Typography
                                      variant='subtitle1'
                                      color='textPrimary'>
                                      You played{' '}
                                      <strong>
                                        {playerPlayRound ? 'Up' : 'Down'}{' '}
                                      </strong>
                                      on this round
                                    </Typography>
                                  </Box>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                        )}

                      {canWeSetupChallenge && (
                        <Grid item xs={12}>
                          <Grid container spacing={4}>
                            <Grid item xs={12}>
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
                          </Grid>
                        </Grid>
                      )}
                      {canWeStartGame && (
                        <Grid item xs={12}>
                          <Grid container spacing={4}>
                            <Grid item xs={12}>
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
                          </Grid>
                        </Grid>
                      )}

                      {canWeEndGame && (
                        <Grid item xs={12}>
                          <Grid container spacing={4}>
                            <Grid item xs={12}>
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
                          </Grid>
                        </Grid>
                      )}
                      {isFinishGameState && (
                        <Grid item xs={12}>
                          <Box display={'flex'} justifyContent={'center'}>
                            <Typography variant='subtitle1' color='textPrimary'>
                              {playerChallengeResult === false &&
                                'You lost this Challenge'}
                              {playerChallengeResult === true &&
                                'You passed this Challenge, Congrats!'}
                            </Typography>
                          </Box>
                        </Grid>
                      )}

                      {isStartedGameState && (
                        <>
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
                                    <Typography
                                      variant='body1'
                                      color='textPrimary'>
                                      {convertUSDPriceUnit(
                                        gameDataRoundQuery.data?.start_price,
                                      )}{' '}
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
                                    <Typography
                                      variant='body1'
                                      color='textPrimary'>
                                      {convertUSDPriceUnit(
                                        gameDataRoundQuery.data
                                          ?.feedPriceCurrentRound,
                                      )}{' '}
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
                          {currentScore && (
                            <Grid item xs={12}>
                              <Box display={'flex'} justifyContent={'center'}>
                                <Typography
                                  variant='subtitle1'
                                  color='textPrimary'>
                                  Coin is going{' '}
                                  <strong>
                                    {currentScore.gte('0') ? 'Up' : 'Down'}{' '}
                                  </strong>
                                  on this round
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                        </>
                      )}
                      {isFinishGameState && (
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
                                        {lastChallengeTimestamp && (
                                          <Countdown
                                            startTimestamp={
                                              lastChallengeTimestamp.toNumber() +
                                              24 * 3600
                                            }
                                          />
                                        )}
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
                      )}
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
        {!isJoinGameState && (
          <Grid item xs={12}>
            <Typography variant='subtitle1' color='textPrimary'>
              <IntlMessages
                id='squidLeague.players'
                defaultMessage={'Players'}
              />{' '}
              {gameDataRoundQuery.data?.total_players.toString()}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              <IntlMessages
                id='squidLeague.pointsAreCountedHourly'
                defaultMessage={'Points are counted hourly'}
              />
            </Typography>
          </Grid>
        )}
        {isJoinGameState && (
          <Grid item xs={12}>
            <Typography variant='subtitle1' color='textPrimary'>
              <IntlMessages
                id='squidLeague.joinedPlayers'
                defaultMessage={'Joined Players'}
              />{' '}
              {gameDataQuery.data?.joinedPlayers.toString()}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              <IntlMessages
                id='squidLeague.pointsAreCountedHourly'
                defaultMessage={'Points are counted hourly'}
              />
            </Typography>
          </Grid>
        )}
      </Grid>
    </MainLayout>
  );
};

export default GameLayout;
