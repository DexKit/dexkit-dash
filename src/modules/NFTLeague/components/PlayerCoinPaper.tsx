import IntlMessages from '@crema/utility/IntlMessages';
import {
  Grid,
  Box,
  Paper,
  Typography,
  makeStyles,
  Divider,
  Button,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import {useChampionMetadataQuery} from 'modules/CoinLeagues/hooks/champions';
import React from 'react';
import {getNormalizedUrl} from 'utils/browser';
import {useModuleStyle} from '../styles';

import {ReactComponent as UserSquareIcon} from '../assets/user-square.svg';

const useStyle = makeStyles((theme) => ({
  coinSelectImage: {
    height: 'auto',
    width: theme.spacing(20),
  },
}));

interface Props {
  tokenId?: string;
  score?: number;
  multiplier?: number;
  initialPrice?: number;
  currentPrice?: number;
  winner?: boolean;
  state: 'waiting' | 'winner' | 'inprogress';
  account?: string;
  onJoinGame?: () => void;
}

export const PlayerCoinPaper: React.FC<Props> = ({
  tokenId,
  score,
  multiplier,
  initialPrice,
  currentPrice,
  state,
  account,
  onJoinGame,
}) => {
  const metadataQuery = useChampionMetadataQuery(tokenId);

  const classes = useStyle();

  const moduleClasses = useModuleStyle();

  if (state === 'winner' || state === 'inprogress') {
    return (
      <Box p={4} height='100%' component={Paper}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid
              container
              alignItems='center'
              alignContent='center'
              spacing={4}>
              <Grid item>
                <Box display='flex' alignItems='center' alignContent='center'>
                  {metadataQuery?.isLoading || !metadataQuery?.data?.image ? (
                    <Skeleton
                      variant='rect'
                      className={classes.coinSelectImage}
                    />
                  ) : (
                    <img
                      src={getNormalizedUrl(metadataQuery?.data?.image)}
                      alt={metadataQuery?.data?.name}
                      className={classes.coinSelectImage}
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs>
                <Grid
                  container
                  alignItems='center'
                  alignContent='center'
                  spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      className={moduleClasses.boldText}
                      color='textPrimary'
                      variant='subtitle1'>
                      {metadataQuery.isLoading ? (
                        <Skeleton />
                      ) : (
                        metadataQuery.data?.name
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={4}>
                      <Grid item>
                        <Typography color='textSecondary' variant='body2'>
                          ATK
                        </Typography>
                        <Typography
                          className={moduleClasses.boldText}
                          color='textPrimary'
                          variant='subtitle1'>
                          {metadataQuery.isLoading ? (
                            <Skeleton />
                          ) : (
                            metadataQuery.data?.attributes.find(
                              (a) => a.trait_type === 'Attack',
                            )?.value
                          )}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography color='textSecondary' variant='body2'>
                          DEF
                        </Typography>
                        <Typography
                          className={moduleClasses.boldText}
                          color='textPrimary'
                          variant='subtitle1'>
                          {metadataQuery.isLoading ? (
                            <Skeleton />
                          ) : (
                            metadataQuery.data?.attributes.find(
                              (a) => a.trait_type === 'Defense',
                            )?.value
                          )}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography color='textSecondary' variant='body2'>
                          RUN
                        </Typography>
                        <Typography
                          className={moduleClasses.boldText}
                          color='textPrimary'
                          variant='subtitle1'>
                          {metadataQuery.isLoading ? (
                            <Skeleton />
                          ) : (
                            metadataQuery.data?.attributes.find(
                              (a) => a.trait_type === 'Run',
                            )?.value
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper variant='outlined'>
              <Box
                p={2}
                display='flex'
                alignContent='center'
                alignItems='center'
                justifyContent='space-between'>
                <Typography
                  color='textPrimary'
                  className={moduleClasses.boldText}
                  variant='body1'>
                  {score}
                </Typography>
                <Typography color='textPrimary' variant='body1'>
                  <IntlMessages id='nftLeague.score' />
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper variant='outlined'>
                  <Box
                    p={2}
                    display='flex'
                    alignContent='center'
                    alignItems='center'
                    justifyContent='space-between'>
                    <Typography
                      color='textPrimary'
                      className={moduleClasses.boldText}
                      variant='body1'>
                      {initialPrice} USD
                    </Typography>
                    <Typography color='textSecondary' variant='body1'>
                      <IntlMessages id='nftLeague.initialPrice' />
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper variant='outlined'>
                  <Box
                    p={2}
                    display='flex'
                    alignContent='center'
                    alignItems='center'
                    justifyContent='space-between'>
                    <Typography
                      color='textPrimary'
                      className={moduleClasses.boldText}
                      variant='body1'>
                      {currentPrice} USD
                    </Typography>
                    <Typography color='textSecondary' variant='body1'>
                      <IntlMessages id='nftLeague.currentPrice' />
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper variant='outlined'>
                  <Box
                    p={2}
                    display='flex'
                    alignContent='center'
                    alignItems='center'
                    justifyContent='space-between'>
                    <Typography
                      color='textPrimary'
                      className={moduleClasses.boldText}
                      variant='body1'>
                      {multiplier}x
                    </Typography>
                    <Typography color='textSecondary' variant='body1'>
                      <IntlMessages id='nftLeague.multiplier' />
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  } else {
    return (
      <Box
        height='100%'
        p={4}
        component={Paper}
        display='flex'
        alignItems='center'
        alignContent='center'
        justifyContent='center'>
        <Box>
          <Grid
            container
            direction='column'
            spacing={4}
            alignItems='center'
            alignContent='center'
            justifyContent='center'>
            <Grid item>
              <UserSquareIcon />
            </Grid>
            <Grid item>
              <Typography align='center' color='textSecondary' variant='body1'>
                <IntlMessages id='nftLeague.waitingOpponent' />
              </Typography>
            </Grid>
            {onJoinGame && (
              <Grid item>
                <Button
                  onClick={onJoinGame}
                  variant='contained'
                  color='primary'>
                  <IntlMessages id='nftLeague.joinGame' />
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    );
  }
};
