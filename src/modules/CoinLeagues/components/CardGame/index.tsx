import React, {useCallback, useMemo, useState} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {alpha, ButtonBase, Chip, Tooltip} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import {makeStyles, useTheme} from '@material-ui/core/styles';

import {BigNumber, ethers} from 'ethers';
import {useInterval} from 'hooks/utils/useInterval';
import {GET_LABEL_FROM_DURATION} from 'modules/CoinLeagues/utils/time';
import {strPad} from 'modules/CoinLeagues/utils/time';
import {CardTimer} from '../CardTimer';
import {GameGraph} from 'modules/CoinLeagues/utils/types';
import {GET_GAME_LEVEL} from 'modules/CoinLeagues/utils/game';

import ViewGameMetadataModal from '../ViewGameMetadataModal';
import IconButton from '@material-ui/core/IconButton';
import {ReactComponent as CrownIcon} from 'assets/images/icons/crown.svg';

import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {Paper} from '@material-ui/core';
import {Share as ShareIcon} from '@material-ui/icons';
import {FormattedMessage, useIntl} from 'react-intl';

import {ReactComponent as CoinIcon} from '../../assets/coin.svg';
import {ReactComponent as ProfileTwoUserIcon} from '../../assets/profile-2user.svg';
import {ReactComponent as ReceiveSquareIcon} from '../../assets/receive-square.svg';
import {ReactComponent as SendSquareIcon} from '../../assets/send-square.svg';
import {ReactComponent as TimerIcon} from '../../assets/timer.svg';
import {ReactComponent as ChartSquareIcon} from '../../assets/chart-square.svg';

import {withStyles} from '@material-ui/styles';
import {Skeleton} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      stroke: theme.palette.text.primary,
    },
  },
  timer: {
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
  },
}));

const JoinGameButton = withStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    borderRadius: theme.shape.borderRadius,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
}))(ButtonBase);

interface Props {
  id?: string;
  game?: GameGraph;
  onClick?: (address: string) => void;
  onShare?: (id?: string) => void;
  btnMessage?: string;
  loading?: boolean;
}

const CardGame: React.FC<Props> = ({
  game,
  onClick,
  btnMessage,
  loading,
  onShare,
}) => {
  const classes = useStyles();

  const {formatMessage} = useIntl();

  const theme = useTheme();

  const {chainId, coinSymbol} = useLeaguesChainInfo();
  /* const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(game.amount_to_play.toNumber()  );*/

  const [countdown, setCountdown] = useState<number>();

  const prizeTotalValue = useMemo(() => {
    if (game) {
      return ethers.utils.formatEther(
        BigNumber.from(game?.entry).mul(BigNumber.from(game.numPlayers)),
      );
    }

    return '';
  }, [game]);

  const time = useMemo(() => {
    if (game) {
      return Number(game.duration);
    }

    return 0;
  }, [game]);

  const coins = useMemo(() => {
    if (game) {
      return Number(game.numCoins);
    }

    return 0;
  }, [game]);

  const gameLevel =
    game !== undefined
      ? GET_GAME_LEVEL(BigNumber.from(game.entry), chainId)
      : '';

  const [openShowGameMetadataModal, setOpenShowGameMetadataModal] =
    useState(false);
  // Format number values

  const entriesIn = strPad(Number(game?.currentPlayers) || 0);
  const entriesOut = strPad(Number(game?.numPlayers) || 0);

  /* eslint-disable */
  const onClickEnter = useCallback(
    (ev: any) => {
      if (onClick && game != undefined) {
        onClick(game.intId);
      }
    },
    [game, onClick],
  );

  useInterval(
    () => {
      const startTime = Math.floor(
        Number(game?.startsAt || 0) - Math.round(new Date().getTime() / 1000),
      );
      setCountdown(startTime);
    },
    1000,
    true,
  );

  return (
    <Paper
      variant={game?.title ? 'outlined' : 'elevation'}
      style={
        game?.title
          ? {borderColor: theme.palette.primary.main, borderWidth: 2}
          : undefined
      }>
      <Box px={4} py={2} bgcolor={alpha(theme.palette.background.default, 0.6)}>
        {game?.title ? (
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'>
            <Typography variant='subtitle2'>
              #{game?.intId} - ${game?.title}
            </Typography>
            <IconButton
              onClick={() => setOpenShowGameMetadataModal(true)}
              size='small'>
              <CrownIcon />
            </IconButton>
            <ViewGameMetadataModal
              open={openShowGameMetadataModal}
              setOpen={setOpenShowGameMetadataModal}
              gameMetadata={game}
            />
          </Box>
        ) : (
          <Box
            display='flex'
            alignItems='center'
            alignContent=''
            justifyContent='space-between'>
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
                <FormattedMessage
                  id='coinLeague.share'
                  defaultMessage='Share'
                />
              </Button>
            )}
          </Box>
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
                    id='app.coinLeagues.maxPrize'
                    defaultMessage='Max Prize'
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
                          id='coinLeague.gameLevel'
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
        </Grid>
      </Box>
      {!loading && (
        <Box p={4} bgcolor={alpha(theme.palette.background.default, 0.6)}>
          <Grid container spacing={4}>
            {!game?.startedAt && (
              <Grid item xs={12}>
                <Box className={classes.timer}>
                  <Typography
                    style={
                      countdown !== undefined && countdown > 0
                        ? {color: theme.palette.primary.main}
                        : {color: theme.palette.success.main}
                    }
                    variant='body1'
                    align='center'>
                    {countdown !== undefined && countdown > 0 ? (
                      <>
                        <IntlMessages
                          id='coinLeague.startsIn'
                          defaultMessage='Starts in'
                        />
                        : <CardTimer time={countdown} />
                      </>
                    ) : (
                      <IntlMessages
                        id='coinLeague.readyToPlay'
                        defaultMessage='Ready to Play'
                      />
                    )}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <JoinGameButton color='primary' onClick={onClickEnter}>
                <Box>
                  <Typography
                    style={{textTransform: 'uppercase', fontWeight: 500}}
                    variant='body1'>
                    {game?.startedAt ? (
                      formatMessage({
                        id: 'app.coinLeagues.viewGame',
                        defaultMessage: 'View Game',
                      })
                    ) : (
                      <IntlMessages
                        id='app.coinLeagues.joinGame'
                        defaultMessage='Join Game'
                      />
                    )}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    style={{textTransform: 'uppercase', fontWeight: 500}}
                    variant='body1'>
                    {ethers.utils.formatEther(game?.entry || 0)} {coinSymbol}
                  </Typography>
                </Box>
              </JoinGameButton>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default CardGame;
