import React, {useCallback, useState} from 'react';

import humanizeDuration from 'humanize-duration';

import IntlMessages from '@crema/utility/IntlMessages';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {alpha, ButtonBase, Chip, Tooltip} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import {makeStyles, useTheme} from '@material-ui/core/styles';

import {ethers} from 'ethers';
import {GameGraph} from 'modules/NFTLeague/utils/types';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {Paper} from '@material-ui/core';
import {EventRounded, Share as ShareIcon} from '@material-ui/icons';
import {FormattedMessage} from 'react-intl';

import {ReactComponent as ReceiveSquareIcon} from 'modules/CoinLeague/assets/receive-square.svg';
import {ReactComponent as SendSquareIcon} from 'modules/CoinLeague/assets/send-square.svg';
import {ReactComponent as TimerIcon} from 'modules/CoinLeague/assets/timer.svg';
import {withStyles} from '@material-ui/styles';
import {Skeleton} from '@material-ui/lab';
import Countdown from 'shared/components/Countdown';
import NFTLeagueAvatar from './NFTLeagueAvatar';

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

  const theme = useTheme();

  const {coinSymbol} = useLeaguesChainInfo();

  /* eslint-disable */
  const onClickEnter = useCallback(
    (ev: any) => {
      if (onClick && game !== undefined) {
        onClick(game.id);
      }
    },
    [game, onClick],
  );

  const [gameReady, setGameReady] = useState(false);

  return (
    <Paper>
      <Box px={4} py={2} bgcolor={alpha(theme.palette.background.default, 0.6)}>
        <Box
          display='flex'
          alignItems='center'
          alignContent=''
          justifyContent='space-between'>
          <Typography variant='subtitle2'>
            {loading ? <Skeleton /> : <>#{game?.id}</>}{' '}
          </Typography>
          {!loading && (
            <Button
              onClick={() => {
                if (onShare) {
                  onShare(game?.id);
                }
              }}
              startIcon={<ShareIcon />}>
              <FormattedMessage id='coinLeague.share' defaultMessage='Share' />
            </Button>
          )}
        </Box>
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
              <Grid item>
                <Typography variant='body1'>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    <>
                      {ethers.utils.formatEther(
                        ethers.BigNumber.from(game?.entry || '0')
                          .mul(2)
                          .toString(),
                      )}{' '}
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
                    id='app.coinLeagues.gameInfo'
                    defaultMessage='Game Information'
                  />
                </Typography>
              </Grid>

              <Grid item>
                <Chip
                  size='small'
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
              <Grid item>
                <Tooltip
                  title={
                    <IntlMessages
                      id='nftLeague.status'
                      defaultMessage='Status'
                    />
                  }>
                  <Chip
                    size='small'
                    label={
                      game?.status === 'Waiting' ? (
                        <IntlMessages
                          id='nftLeague.waiting'
                          defaultMessage='Waiting'
                        />
                      ) : game?.status === 'Ended' ? (
                        <IntlMessages
                          id='nftLeague.ended'
                          defaultMessage='Ended'
                        />
                      ) : game?.status === 'Started' ? (
                        <IntlMessages
                          id='nftLeague.inProgress'
                          defaultMessage='In Progress'
                        />
                      ) : undefined
                    }
                    variant='outlined'
                  />
                </Tooltip>
              </Grid>
              <Grid item>
                <Chip
                  size='small'
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
                  label={
                    loading ? (
                      <Skeleton />
                    ) : (
                      humanizeDuration(parseInt(game?.duration || '0') * 1000)
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
                    id='nftLeague.players'
                    defaultMessage='Players'
                  />
                </Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  {game?.players?.map((player, index: number) => (
                    <Grid item key={index}>
                      <NFTLeagueAvatar player={player} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {!loading && (
        <Box p={4} bgcolor={alpha(theme.palette.background.default, 0.6)}>
          <Grid container spacing={4}>
            {game?.status === 'Waiting' ? (
              <Grid item xs={12}>
                <Box className={classes.timer}>
                  <Typography variant='body1' align='center'>
                    {moment(parseInt(game?.startsAt || '0') * 1000).isBefore(
                      moment(),
                    ) ? (
                      <IntlMessages
                        id='nftLeague.gameReady'
                        defaultMessage='Ready'
                      />
                    ) : (
                      <>
                        <IntlMessages
                          id='nftLeague.startsIn'
                          defaultMessage='Starts in'
                        />{' '}
                        <Countdown
                          startTimestamp={parseInt(game?.startsAt || '0')}
                          onEndCallback={() => setGameReady(true)}
                        />
                      </>
                    )}
                  </Typography>
                </Box>
              </Grid>
            ) : game?.status === 'Started' ? (
              <Grid item xs={12}>
                <Box
                  className={classes.timer}
                  display='flex'
                  alignItems='center'
                  justifyContent='center'>
                  {moment(parseInt(game?.startsAt || '0')).isAfter(moment()) ? (
                    <Chip
                      variant='outlined'
                      size='small'
                      icon={<EventRounded />}
                      label={
                        <>
                          <IntlMessages
                            id='nftLeague.started'
                            defaultMessage='Started'
                          />{' '}
                          <Countdown
                            startTimestamp={parseInt(game?.startedAt || '0')}
                            duration={parseInt(game?.duration)}
                          />
                        </>
                      }
                    />
                  ) : (
                    <Typography variant='body1'>
                      <IntlMessages
                        id='nftLeague.gameEnded'
                        defaultMessage='Game Ended'
                      />
                    </Typography>
                  )}
                </Box>
              </Grid>
            ) : game?.status === 'Ended' ? (
              <Grid item xs={12}>
                <Box
                  className={classes.timer}
                  display='flex'
                  alignItems='center'
                  justifyContent='center'>
                  <Typography variant='body1'>
                    <IntlMessages id='nftLeague.ended' defaultMessage='Ended' />
                  </Typography>
                </Box>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <JoinGameButton color='primary' onClick={onClickEnter}>
                <Box>
                  <Typography
                    style={{textTransform: 'uppercase', fontWeight: 500}}
                    variant='body1'>
                    <IntlMessages id='nftLeague.view' defaultMessage='View' />
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
