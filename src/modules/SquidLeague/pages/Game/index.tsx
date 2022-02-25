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
import {useParams} from 'react-router';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

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

  const {messages} = useIntl();

  const classes = useStyles();

  return (
    <MainLayout>
      <Grid container spacing={4}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <Typography color='textPrimary' variant='subtitle1'>
            <IntlMessages id='squidLeague.gameInformation' />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textPrimary' variant='subtitle1'>
            <IntlMessages id='squidLeague.battle' />
          </Typography>
          <Typography color='textSecondary' variant='body1'>
            <IntlMessages id='squidLeague.guessIfTheCoinWillGoUpOrDown' />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box p={4} component={Paper}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography color='textPrimary' variant='subtitle1'>
                  <IntlMessages id='squidLeague.round' /> 01
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
                                  <IntlMessages id='squidLeague.gameStartsIn' />
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
                                  <IntlMessages id='squidLeague.countDown' />
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
                            <IntlMessages id='squidLeague.thisWillGoUpOrDown' />
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              fullWidth
                              startIcon={<ArrowUpwardIcon />}
                              variant='contained'
                              color='primary'>
                              <IntlMessages id='squidLeague.up' />
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              fullWidth
                              startIcon={<ArrowDownwardIcon />}
                              variant='outlined'
                              color='primary'>
                              <IntlMessages id='squidLeague.down' />
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
                          <IntlMessages id='squidLeague.trackTheCurrency' />
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
                                  <IntlMessages id='squidLeague.initialPrice' />
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
                                  <IntlMessages id='squidLeague.currentPrice' />
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
                                      <IntlMessages id='squidLeague.nextRound' />
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
                              <IntlMessages id='squidGame.waitForTheNextGame' />
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
            <IntlMessages id='squidLeague.shareGame' />
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            <IntlMessages id='squidLeague.shareYourGameWithAnotherPlayers' />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={messages['squidLeague.url'] as string}
            variant='outlined'
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='subtitle1' color='textPrimary'>
            <IntlMessages id='squidLeague.players' /> (1.2)
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            <IntlMessages id='squidLeague.pointsAreCountedHourly' />
          </Typography>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Game;
