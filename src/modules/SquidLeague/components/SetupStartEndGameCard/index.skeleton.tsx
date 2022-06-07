import React, {useCallback, useMemo, useState} from 'react';

import {
  Paper,
  Box,
  Grid,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import {useToggler} from 'hooks/useToggler';

import {useGameAddress} from 'modules/SquidLeague/hooks/useGameAddress';
import {useOnChainGameData} from 'modules/SquidLeague/hooks/useOnChainGameData';
import {useOnChainCurrentRoundGame} from 'modules/SquidLeague/hooks/useOnChainCurrentRoundGame';
import {GameState} from 'modules/SquidLeague/utils/types';

import {MaticPriceFeeds} from 'modules/CoinLeague/constants/PriceFeeds/matic';
import {useWeb3} from 'hooks/useWeb3';
import Countdown from 'modules/SquidLeague/components/Countdown';
import {convertUSDPriceUnit} from 'modules/SquidLeague/utils/format';
import {getLastChallengeTimestamp} from 'modules/SquidLeague/utils/time';
import {ReactComponent as TimerIcon} from 'assets/images/vuesax/twotone/timer.svg';
import {Skeleton} from '@material-ui/lab';

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

export const SetupStartEndGameSkeleton = (props: Params) => {
  const {id} = props;
  const {chainId} = useWeb3();
  const gameAddressQuery = useGameAddress(id);
  const gameDataQuery = useOnChainGameData(gameAddressQuery.data);
  const gameDataRoundQuery = useOnChainCurrentRoundGame(
    gameDataQuery.data?.round,
    gameAddressQuery.data,
  );

  const playGameToggler = useToggler(false);
  const startGameToggler = useToggler(false);
  const endGameToggler = useToggler(false);

  const [userPlay, setUserPlay] = useState(false);

  const classes = useStyles();

  const openPlayModal = useCallback(
    (play: boolean) => {
      playGameToggler.toggle();
      setUserPlay(play);
    },
    [playGameToggler],
  );

  const gameState = gameDataQuery.data?.gameState;
  const isPlayerJoined = gameDataQuery.data?.playerJoined;

  const isSetupGameState = useMemo(() => {
    return gameState === GameState.Setup;
  }, [gameState]);

  const isStartedGameState = useMemo(() => {
    return gameState === GameState.Started;
  }, [gameState]);

  const isFinishGameState = useMemo(() => {
    return gameState === GameState.Finished;
  }, [gameState]);

  const startTimestampRound = gameDataRoundQuery.data?.start_timestamp;

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

  const coin = useMemo(() => {
    return MaticPriceFeeds[0];
  }, []);

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
                        <Typography color='textSecondary' variant='caption'>
                          <Skeleton>
                            {' '}
                            <IntlMessages
                              id='squidLeague.gameStartsIn'
                              defaultMessage={'Game starts in'}
                            />
                          </Skeleton>
                        </Typography>
                        <Typography variant='h5' color='textPrimary'>
                          <Skeleton>
                            {' '}
                            {startTimestampRound && (
                              <Countdown
                                startTimestamp={startTimestampRound.toNumber()}
                                onEndCallback={() =>
                                  gameDataRoundQuery.refetch()
                                }
                              />
                            )}
                          </Skeleton>
                        </Typography>
                      </Box>
                      <Box display={'flex'} justifyContent={'center'}>
                        <TimerIcon />
                      </Box>
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
                        <Typography color='textSecondary' variant='caption'>
                          <Skeleton>
                            {' '}
                            <IntlMessages
                              id='squidLeague.countDown'
                              defaultMessage={'Countdown'}
                            />
                          </Skeleton>
                        </Typography>
                        <Typography variant='h5' color='textPrimary'>
                          <Skeleton>
                            {' '}
                            {startTimestampRound && durationTimestampRound && (
                              <Countdown
                                startTimestamp={startTimestampRound.toNumber()}
                                duration={durationTimestampRound.toNumber()}
                                onEndCallback={() =>
                                  gameDataRoundQuery.refetch()
                                }
                              />
                            )}
                          </Skeleton>
                        </Typography>
                      </Box>
                      <Box display={'flex'} justifyContent={'center'}>
                        <TimerIcon />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )}
            {(isStartedGameState || isFinishGameState || isSetupGameState) &&
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
                              <Skeleton>
                                {' '}
                                <img
                                  src={coin.logo}
                                  alt={coin.baseName}
                                  className={classes.coinImage}
                                />
                              </Skeleton>
                            </Grid>
                            <Grid item>
                              <Typography
                                variant='subtitle1'
                                color='textPrimary'>
                                <Skeleton>
                                  {' '}
                                  {coin.baseName.toUpperCase()}
                                </Skeleton>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Skeleton>
                        {' '}
                        <IntlMessages
                          id='squidLeague.thisWillGoUpOrDown'
                          defaultMessage={'Predict if coin goes up or down'}
                        />
                      </Skeleton>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        disabled={!canWePlayChallenge}
                        startIcon={<ArrowUpwardIcon />}
                        variant='contained'
                        color='primary'>
                        <Skeleton>
                          {' '}
                          <IntlMessages
                            id='squidLeague.up'
                            defaultMessage={'Up'}
                          />
                        </Skeleton>
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        disabled={!canWePlayChallenge}
                        startIcon={<ArrowDownwardIcon />}
                        variant='outlined'
                        color='primary'>
                        <Skeleton>
                          {' '}
                          <IntlMessages
                            id='squidLeague.down'
                            defaultMessage={'Down'}
                          />
                        </Skeleton>
                      </Button>
                    </Grid>
                    {
                      <Grid item xs={12}>
                        <Box display={'flex'} justifyContent={'center'}>
                          <Typography variant='subtitle1' color='textPrimary'>
                            <Skeleton>
                              {' '}
                              You played{' '}
                              <strong>
                                {playerPlayRound ? 'Up' : 'Down'}{' '}
                              </strong>
                              on this round
                            </Skeleton>
                          </Typography>
                        </Box>
                      </Grid>
                    }
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
                      <Skeleton>
                        {' '}
                        <IntlMessages
                          id='squidLeague.startGame'
                          defaultMessage={'Start Game'}
                        />
                      </Skeleton>
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
                      <Skeleton>
                        {' '}
                        <IntlMessages
                          id='squidLeague.endGame'
                          defaultMessage={'End Game'}
                        />
                      </Skeleton>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {isFinishGameState && (
              <Grid item xs={12}>
                <Box display={'flex'} justifyContent={'center'}>
                  <Typography variant='subtitle1' color='textPrimary'>
                    <Skeleton>
                      {' '}
                      {playerChallengeResult === false &&
                        'You lost this Challenge'}
                      {playerChallengeResult === true &&
                        'You passed this Challenge, Congrats!'}
                    </Skeleton>
                  </Typography>
                </Box>
              </Grid>
            )}

            {isStartedGameState && (
              <>
                <Grid item xs={12}>
                  <Typography variant='subtitle1' color='textPrimary'>
                    <Skeleton>
                      {' '}
                      <IntlMessages
                        id='squidLeague.trackTheCurrency'
                        defaultMessage={'Track Currency'}
                      />
                    </Skeleton>
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
                            <Skeleton>
                              {' '}
                              {convertUSDPriceUnit(
                                gameDataRoundQuery.data?.start_price,
                              )}{' '}
                              USD
                            </Skeleton>
                          </Typography>
                          <Typography variant='body1' color='textSecondary'>
                            <Skeleton>
                              {' '}
                              <IntlMessages
                                id='squidLeague.initialPrice'
                                defaultMessage={'Initial Price'}
                              />
                            </Skeleton>
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
                            <Skeleton>
                              {' '}
                              {convertUSDPriceUnit(
                                gameDataRoundQuery.data?.feedPriceCurrentRound,
                              )}{' '}
                              USD
                            </Skeleton>
                          </Typography>
                          <Typography variant='body1' color='textSecondary'>
                            <Skeleton>
                              {' '}
                              <IntlMessages
                                id='squidLeague.currentPrice'
                                defaultMessage={'Current Price'}
                              />
                            </Skeleton>
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                {currentScore && (
                  <Grid item xs={12}>
                    <Box display={'flex'} justifyContent={'center'}>
                      <Typography variant='subtitle1' color='textPrimary'>
                        <Skeleton>
                          {' '}
                          Coin is going{' '}
                          <strong>
                            {currentScore.gte('0') ? 'Up' : 'Down'}{' '}
                          </strong>
                          on this round
                        </Skeleton>
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
                            <Typography color='textSecondary' variant='caption'>
                              <Skeleton>
                                {' '}
                                <IntlMessages
                                  id='squidLeague.nextRound'
                                  defaultMessage={'Next Round'}
                                />
                              </Skeleton>
                            </Typography>
                            <Typography variant='h5' color='textPrimary'>
                              <Skeleton>
                                {' '}
                                {lastChallengeTimestamp && (
                                  <Countdown
                                    startTimestamp={getLastChallengeTimestamp(
                                      lastChallengeTimestamp,
                                      chainId,
                                    )}
                                  />
                                )}
                              </Skeleton>
                            </Typography>
                          </Box>
                          <Box display={'flex'} justifyContent={'center'}>
                            <TimerIcon />
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body1' color='textSecondary'>
                      <Skeleton>
                        {' '}
                        <IntlMessages
                          id='squidGame.waitForTheNextGame'
                          defaultMessage={'Wait for next game'}
                        />
                      </Skeleton>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SetupStartEndGameSkeleton;
