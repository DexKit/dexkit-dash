import React, {useCallback, useMemo, useState} from 'react';

import {useTheme, alpha, Chip, Tooltip, makeStyles} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {BigNumber, ethers} from 'ethers';

import {useInterval} from 'hooks/utils/useInterval';
import {CardTimer} from '../CardTimer';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {GameGraph} from 'modules/CoinLeague/utils/types';
import {GET_GAME_LEVEL} from 'modules/CoinLeague/utils/game';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {Skeleton} from '@material-ui/lab';

import {Share as ShareIcon} from '@material-ui/icons';

import {ReactComponent as CoinIcon} from '../../assets/coin.svg';
import {ReactComponent as ProfileTwoUserIcon} from '../../assets/profile-2user.svg';
import {ReactComponent as ReceiveSquareIcon} from '../../assets/receive-square.svg';
import {ReactComponent as SendSquareIcon} from '../../assets/send-square.svg';
import {ReactComponent as TimerIcon} from '../../assets/timer.svg';
import {ReactComponent as ChartSquareIcon} from '../../assets/chart-square.svg';
import {GET_LABEL_FROM_DURATION, strPad} from 'modules/CoinLeague/utils/time';
import {useCoinToPlay} from 'modules/CoinLeague/hooks/useCoinToPlay';

interface Props {
  game?: GameGraph;
  btnMessage?: string;
  onClick?: any;
  onShare?: (id?: string) => void;
  loading?: boolean;
}
const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      stroke: theme.palette.text.primary,
    },
  },
}));

function SmallCardGame({
  game,
  onClick,
  loading,
  onShare,
  btnMessage,
}: Props): JSX.Element {
  const {chainId} = useLeaguesChainInfo();
  const [countdown, setCountdown] = useState<number>();
  const classes = useStyles();
  /* const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.prizePool);*/

  const coinToPlay = useCoinToPlay(chainId, game?.coinToPlay);
  const currencySymbol = coinToPlay?.symbol.toUpperCase() || '';
  const gameLevel = GET_GAME_LEVEL(
    BigNumber.from(game?.entry || '0'),
    chainId,
    game?.coinToPlay,
  );

  const prizeTotalValue = ethers.utils.formatUnits(
    BigNumber.from(game?.entry || 0).mul(
      BigNumber.from(game?.currentPlayers || 0),
    ),
    coinToPlay?.decimals,
  );

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
      const time = Number(game?.duration || 0);
      const startTime =
        Math.round(new Date().getTime() / 1000) - Number(game?.startedAt || 0);
      setCountdown(time - startTime);
    },
    1000,
    true,
  );

  const onClickEnter = useCallback(
    (_ev: any): void => {
      onClick(game?.intId);
    },
    [game, onClick],
  );

  const theme = useTheme();

  return (
    <Paper
      variant={game?.title ? 'outlined' : 'elevation'}
      style={
        game?.title
          ? {borderColor: theme.palette.primary.main, borderWidth: 2}
          : undefined
      }>
      <Box
        px={4}
        py={2}
        display='flex'
        alignItems='center'
        alignContent='center'
        justifyContent='space-between'
        bgcolor={alpha(theme.palette.background.default, 0.6)}>
        <Typography variant='subtitle2'>
          {loading ? <Skeleton /> : <>#{game?.intId}</>}{' '}
        </Typography>
        {!loading && (
          <Button
            onClick={() => {
              if (onShare) {
                onShare(game?.intId);
              }
            }}
            startIcon={<ShareIcon />}>
            <IntlMessages id='coinLeague.share' defaultMessage='Share' />
          </Button>
        )}
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
                        {currencySymbol}
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
                    id='app.coinLeagues.gameType'
                    defaultMessage='Game Type'
                  />
                </Typography>
              </Grid>
              <Grid item>
                <Chip
                  icon={
                    <Tooltip
                      title={
                        <IntlMessages
                          id='coinLeague.gameLEvel'
                          defaultMessage='Game Level'
                        />
                      }>
                      <ChartSquareIcon className={classes.icon} />
                    </Tooltip>
                  }
                  label={loading ? <Skeleton /> : gameLevel}
                  variant='outlined'
                />
              </Grid>
              <Grid item>
                <Chip
                  icon={
                    <Tooltip
                      title={
                        <IntlMessages
                          id='coinLeague.type'
                          defaultMessage='Type'
                        />
                      }>
                      {loading ? (
                        <Skeleton variant='circle' width='1rem' height='1rem' />
                      ) : game?.type === 'Bull' ? (
                        <SendSquareIcon className={classes.icon} />
                      ) : (
                        <ReceiveSquareIcon className={classes.icon} />
                      )}
                    </Tooltip>
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
                  icon={
                    <Tooltip
                      title={
                        <IntlMessages
                          id='coinLeague.numberOfCoins'
                          defaultMessage='Number of Coins'
                        />
                      }>
                      <CoinIcon className={classes.icon} />
                    </Tooltip>
                  }
                  variant='outlined'
                  label={loading ? <Skeleton /> : strPad(coins)}
                />
              </Grid>
              <Grid item>
                <Chip
                  icon={
                    <Tooltip
                      title={
                        <IntlMessages
                          id='coinLeague.duration'
                          defaultMessage='Duration'
                        />
                      }>
                      <TimerIcon className={classes.icon} />
                    </Tooltip>
                  }
                  variant='outlined'
                  label={loading ? <Skeleton /> : GET_LABEL_FROM_DURATION(time)}
                />
              </Grid>
              <Grid item>
                <Chip
                  icon={
                    <Tooltip
                      title={
                        <IntlMessages
                          id='coinLeague.players'
                          defaultMessage='Players'
                        />
                      }>
                      <ProfileTwoUserIcon className={classes.icon} />
                    </Tooltip>
                  }
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
              {btnMessage || <IntlMessages id='app.coinLeagues.view' />}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default SmallCardGame;
