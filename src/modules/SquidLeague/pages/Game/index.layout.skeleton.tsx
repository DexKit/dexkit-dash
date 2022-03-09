import React from 'react';
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
import {Skeleton} from '@material-ui/lab';

import {MaticPriceFeeds} from 'modules/CoinLeagues/constants/PriceFeeds/matic';

const useStyles = makeStyles((theme) => ({
  coinImage: {
    borderRadius: '50%',
    width: theme.spacing(24),
    height: theme.spacing(24),
  },
}));

export const GameLayoutSkeleton = () => {
  const {formatMessage} = useIntl();
  const classes = useStyles();
  const coin = MaticPriceFeeds[0];

  return (
    <MainLayout>
      <Grid container spacing={4}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <Typography color='textPrimary' variant='subtitle1'>
            <Skeleton>
              {' '}
              <IntlMessages
                id='squidLeague.gameInformation'
                defaultMessage={'Squid League'}
              />{' '}
              #{1}
            </Skeleton>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textPrimary' variant='subtitle1'>
            <Skeleton>
              {' '}
              <IntlMessages id='squidLeague.battle' defaultMessage={'Battle'} />
            </Skeleton>
          </Typography>
          <Typography color='textSecondary' variant='body1'>
            <Skeleton>
              {' '}
              <IntlMessages
                id='squidLeague.guessIfTheCoinWillGoUpOrDown'
                defaultMessage={
                  'Be a prediction wizard and guess if coin will go up or down in an hour'
                }
              />
            </Skeleton>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box p={4} component={Paper}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography color='textPrimary' variant='subtitle1'>
                  <Skeleton>
                    {' '}
                    <IntlMessages
                      id='squidLeague.round'
                      defaultMessage={'Round'}
                    />{' '}
                    1
                  </Skeleton>
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
                                  <Skeleton>
                                    {' '}
                                    <IntlMessages
                                      id='squidLeague.gameStartsIn'
                                      defaultMessage={'Game starts in'}
                                    />
                                  </Skeleton>
                                </Typography>
                                <Typography variant='h5' color='textPrimary'>
                                  <Skeleton> 00.00.00</Skeleton>
                                </Typography>
                              </Box>
                              <Box>
                                {' '}
                                <Skeleton> Icon</Skeleton>
                              </Box>
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
                                  <Skeleton>
                                    {' '}
                                    <IntlMessages
                                      id='squidLeague.entry'
                                      defaultMessage={'Entry'}
                                    />
                                  </Skeleton>
                                </Typography>
                                <Typography variant='h5' color='textPrimary'>
                                  <Skeleton> 1 MATIC </Skeleton>
                                </Typography>
                              </Box>
                              <Box>
                                <Skeleton>Icon</Skeleton>
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          startIcon={<ArrowDownwardIcon />}
                          variant='outlined'
                          color='primary'>
                          <Skeleton>
                            {' '}
                            <IntlMessages
                              id='squidLeague.joinGame'
                              defaultMessage={'Join Game'}
                            />
                          </Skeleton>
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
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
                                  <Skeleton>
                                    {' '}
                                    <IntlMessages
                                      id='squidLeague.gameStartsIn'
                                      defaultMessage={'Game starts in'}
                                    />
                                  </Skeleton>
                                </Typography>
                                <Typography variant='h5' color='textPrimary'>
                                  <Skeleton> 00.00.00</Skeleton>
                                </Typography>
                              </Box>
                              <Box>
                                {' '}
                                <Skeleton> Icon</Skeleton>
                              </Box>
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
                                  <Skeleton>
                                    {' '}
                                    <IntlMessages
                                      id='squidLeague.countDown'
                                      defaultMessage={'Countdown'}
                                    />
                                  </Skeleton>
                                </Typography>
                                <Typography variant='h5' color='textPrimary'>
                                  <Skeleton> 00.00.00</Skeleton>
                                </Typography>
                              </Box>
                              <Box>
                                <Skeleton>Icon</Skeleton>
                              </Box>
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
                                      <Skeleton> Bitcoin</Skeleton>
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
                                defaultMessage={
                                  'Predict if coin goes up or down'
                                }
                              />
                            </Skeleton>
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              fullWidth
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
                          <Grid item xs={12}>
                            <Box display={'flex'} justifyContent={'center'}>
                              <Typography
                                variant='subtitle1'
                                color='textPrimary'>
                                <Skeleton> You played on this round</Skeleton>
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <Button
                              fullWidth
                              startIcon={<ArrowDownwardIcon />}
                              variant='outlined'
                              color='primary'>
                              <Skeleton>
                                {' '}
                                <IntlMessages
                                  id='squidLeague.setupGame'
                                  defaultMessage={'Setup Game'}
                                />
                              </Skeleton>
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <Button
                              fullWidth
                              startIcon={<ArrowDownwardIcon />}
                              variant='outlined'
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

                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <Button
                              fullWidth
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

                      <Grid item xs={12}>
                        <Box display={'flex'} justifyContent={'center'}>
                          <Typography variant='subtitle1' color='textPrimary'>
                            <Skeleton>
                              {' '}
                              You passed this Challenge, Congrats!
                            </Skeleton>
                          </Typography>
                        </Box>
                      </Grid>

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
                                  <Skeleton>10.0 USD</Skeleton>
                                </Typography>
                                <Typography
                                  variant='body1'
                                  color='textSecondary'>
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
                                  <Skeleton> 10.00 USD</Skeleton>
                                </Typography>
                                <Typography
                                  variant='body1'
                                  color='textSecondary'>
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
                                      <Skeleton>
                                        {' '}
                                        <IntlMessages
                                          id='squidLeague.nextRound'
                                          defaultMessage={'Next Round'}
                                        />
                                      </Skeleton>
                                    </Typography>
                                    <Typography
                                      variant='h5'
                                      color='textPrimary'>
                                      <Skeleton> 00.00.00</Skeleton>
                                    </Typography>
                                  </Box>
                                  <Box>
                                    {' '}
                                    <Skeleton> Icon</Skeleton>
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
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='subtitle1' color='textPrimary'>
            <Skeleton>
              {' '}
              <IntlMessages
                id='squidLeague.shareGame'
                defaultMessage={'Share game'}
              />
            </Skeleton>
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            <Skeleton>
              {' '}
              <IntlMessages
                id='squidLeague.shareYourGameWithAnotherPlayers'
                defaultMessage={'Share game with another players'}
              />
            </Skeleton>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Skeleton>
            {' '}
            <TextField
              label={formatMessage({
                id: 'squidLeague.url',
                defaultMessage: 'url',
              })}
              variant='outlined'
              fullWidth
            />
          </Skeleton>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='subtitle1' color='textPrimary'>
            <Skeleton>
              {' '}
              <IntlMessages
                id='squidLeague.players'
                defaultMessage={'Players'}
              />{' '}
            </Skeleton>
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            <Skeleton>
              {' '}
              <IntlMessages
                id='squidLeague.pointsAreCountedHourly'
                defaultMessage={'Points are counted hourly'}
              />
            </Skeleton>
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant='subtitle1' color='textPrimary'>
            <Skeleton>
              {' '}
              <IntlMessages
                id='squidLeague.joinedPlayers'
                defaultMessage={'Joined Players'}
              />{' '}
            </Skeleton>
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            <Skeleton>
              {' '}
              <IntlMessages
                id='squidLeague.pointsAreCountedHourly'
                defaultMessage={'Points are counted hourly'}
              />
            </Skeleton>
          </Typography>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default GameLayoutSkeleton;
