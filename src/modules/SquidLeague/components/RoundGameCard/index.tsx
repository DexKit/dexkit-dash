import React, {useMemo} from 'react';
import MainLayout from 'shared/components/layouts/main';

import {Paper, Box, Grid, Typography, makeStyles} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

import {useToggler} from 'hooks/useToggler';

import {useOnChainCurrentRoundGame} from 'modules/SquidLeague/hooks/useOnChainCurrentRoundGame';
import {BigNumber} from 'ethers';

import {ChainId} from 'types/blockchain';
import {MaticPriceFeeds} from 'modules/CoinLeagues/constants/PriceFeeds/matic';
import {MumbaiPriceFeeds} from 'modules/CoinLeagues/constants';
import {useWeb3} from 'hooks/useWeb3';
import Countdown from 'modules/SquidLeague/components/Countdown';
import {convertUSDPriceUnit} from 'modules/SquidLeague/utils/format';

interface Props {
  round: BigNumber;
  gameAddress: string;
}

const useStyles = makeStyles((theme) => ({
  coinImage: {
    borderRadius: '50%',
    width: theme.spacing(24),
    height: theme.spacing(24),
  },
}));
/**
 * Card to show past rounds results
 * @param props
 * @returns
 */
export const RoundGameCard = (props: Props) => {
  const {round, gameAddress} = props;
  const {chainId} = useWeb3();
  const gameDataRoundQuery = useOnChainCurrentRoundGame(round, gameAddress);

  const classes = useStyles();
  const startTimestampRound = gameDataRoundQuery.data?.start_timestamp;
  const playerJoinedRound = gameDataRoundQuery.data?.playerJoinedCurrentRound;
  const durationTimestampRound = gameDataRoundQuery.data?.duration;

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

  const startPrice = gameDataRoundQuery.data?.start_price;
  const currentPrice = gameDataRoundQuery.data?.feedPriceCurrentRound;

  const currentScore = useMemo(() => {
    if (startPrice && currentPrice) {
      return currentPrice.sub(startPrice).div(currentPrice);
    }
  }, [startPrice, currentPrice]);

  return (
    <MainLayout>
      <Grid container spacing={4}>
        <Grid item xs={12}></Grid>

        <Grid item xs={12}>
          <Box p={4} component={Paper}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography color='textPrimary' variant='subtitle1'>
                  <IntlMessages
                    id='squidLeague.round'
                    defaultMessage={'Round'}
                  />{' '}
                  {round.toNumber()}
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

                      {coin && (
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

                            {(playerPlayRound === false ||
                              playerPlayRound === true) && (
                              <Grid item xs={12}>
                                <Box display={'flex'} justifyContent={'center'}>
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
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default RoundGameCard;
