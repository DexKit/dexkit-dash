import React, {useCallback, useMemo, useState} from 'react';

import {useTheme, alpha, Chip} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {BigNumber, ethers} from 'ethers';
import {makeStyles} from '@material-ui/core/styles';
import {ReactComponent as SendIcon} from 'assets/images/icons/send-square-small.svg';

import {useInterval} from 'hooks/utils/useInterval';
import {CardTimer} from '../CardTimer';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {GameGraph} from 'modules/CoinLeagues/utils/types';
import {GET_GAME_LEVEL} from 'modules/CoinLeagues/utils/game';
import {GET_LEAGUES_CHAIN_ID} from 'modules/CoinLeagues/utils/constants';
import {GET_CHAIN_NATIVE_COIN} from 'shared/constants/Blockchain';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {Skeleton} from '@material-ui/lab';

import {ReactComponent as CoinIcon} from '../../assets/coin.svg';
import {ReactComponent as ProfileTwoUserIcon} from '../../assets/profile-2user.svg';
import {ReactComponent as ReceiveSquareIcon} from '../../assets/receive-square.svg';
import {ReactComponent as SendSquareIcon} from '../../assets/send-square.svg';
import {ReactComponent as TimerIcon} from '../../assets/timer.svg';
import {ReactComponent as ChartSquareIcon} from '../../assets/chart-square.svg';
import {GET_LABEL_FROM_DURATION, strPad} from 'modules/CoinLeagues/utils/time';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  button: {
    fontWeight: 500,
    borderRadius: 6,
    fontSize: '1rem',
    background: '#ffa552',
    justifyContent: 'center',
    padding: theme.spacing(1),
    color: 'black',
  },
  innerContent: {
    fontSize: '1rem',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    justifyContent: 'space-between',
  },
}));

interface Props {
  game: GameGraph;
  btnMessage?: string;
  onClick: any;
  loading?: boolean;
}

function SmallCardGame(props: Props): JSX.Element {
  const {game, onClick, loading} = props;
  const {chainId, coinSymbol} = useLeaguesChainInfo();
  const classes = useStyles();
  const [countdown, setCountdown] = useState<number>();
  /* const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.prizePool);*/
  const gameLevel = GET_GAME_LEVEL(BigNumber.from(game.entry), chainId);

  const prizeTotalValue = ethers.utils.formatEther(
    BigNumber.from(game.entry).mul(BigNumber.from(game.currentPlayers)),
  );
  const entryAmount = ethers.utils.formatEther(game.entry);

  const entriesIn = strPad(Number(game?.currentPlayers) || 0);
  const entriesOut = strPad(Number(game?.numPlayers) || 0);

  const coins = useMemo(() => {
    if (game) {
      return Number(game.numCoins);
    }

    return 0;
  }, [game]);

  const time = useMemo(() => {
    if (game) {
      return Number(game.duration);
    }

    return 0;
  }, [game]);

  useInterval(
    () => {
      const time = Number(game.duration);
      const startTime =
        Math.round(new Date().getTime() / 1000) - Number(game.startedAt || 0);
      setCountdown(time - startTime);
    },
    1000,
    true,
  );

  const onClickEnter = useCallback(
    (_ev: any): void => {
      onClick(game.intId);
    },
    [game.intId, onClick],
  );

  const theme = useTheme();

  return (
    <Paper>
      <Box px={4} py={2} bgcolor={alpha(theme.palette.background.default, 0.6)}>
        <Typography variant='subtitle2'>
          {loading ? <Skeleton /> : <>#{game?.intId}</>}{' '}
        </Typography>
      </Box>
      <Box p={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  gutterBottom>
                  <IntlMessages
                    id='app.coinLeagues.prize'
                    defaultMessage='Prize'
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h5'>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    <>
                      {prizeTotalValue}{' '}
                      <Typography
                        component='span'
                        variant='inherit'
                        color='textSecondary'>
                        {coinSymbol}
                      </Typography>
                    </>
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  gutterBottom>
                  <IntlMessages
                    id='app.coinLeagues.style'
                    defaultMessage='Style'
                  />
                </Typography>
              </Grid>
              <Grid item>
                <Chip
                  icon={<ChartSquareIcon />}
                  label={loading ? <Skeleton /> : gameLevel}
                  variant='outlined'
                />
              </Grid>
              <Grid item>
                <Chip
                  icon={
                    loading ? (
                      <Skeleton variant='circle' width='1rem' height='1rem' />
                    ) : game?.type === 'Bull' ? (
                      <SendSquareIcon />
                    ) : (
                      <ReceiveSquareIcon />
                    )
                  }
                  variant='outlined'
                  label={
                    loading ? (
                      <Skeleton />
                    ) : (
                      <span
                        style={{
                          color:
                            game?.type === 'Bull'
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                        }}>
                        {game?.type === 'Bull' ? 'Bull' : 'Bear'}
                      </span>
                    )
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  gutterBottom>
                  <IntlMessages
                    id='app.coinLeagues.information'
                    defaultMessage='Information'
                  />
                </Typography>
              </Grid>
              <Grid item>
                <Chip
                  icon={<CoinIcon />}
                  variant='outlined'
                  label={loading ? <Skeleton /> : strPad(coins)}
                />
              </Grid>
              <Grid item>
                <Chip
                  icon={<TimerIcon />}
                  variant='outlined'
                  label={loading ? <Skeleton /> : GET_LABEL_FROM_DURATION(time)}
                />
              </Grid>
              <Grid item>
                <Chip
                  icon={<ProfileTwoUserIcon />}
                  variant='outlined'
                  label={
                    loading ? (
                      <Skeleton />
                    ) : (
                      <>
                        {entriesIn}/{entriesOut}{' '}
                        <IntlMessages
                          id='coinLeague.players'
                          defaultMessage='Players'
                        />
                      </>
                    )
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box p={2}>
              <Typography align='center' variant='subtitle1'>
                {countdown && countdown > 0 ? (
                  <CardTimer time={countdown} />
                ) : (
                  <IntlMessages id='app.coinLeagues.ended' />
                )}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={onClickEnter}>
              {props.btnMessage || <IntlMessages id='app.coinLeagues.view' />}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default SmallCardGame;
