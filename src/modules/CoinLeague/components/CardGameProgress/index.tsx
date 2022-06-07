import React, {useCallback, useState} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import {ReactComponent as SendIcon} from 'assets/images/icons/send-square-small.svg';
import {BigNumber, ethers} from 'ethers';
import {useInterval} from 'hooks/utils/useInterval';
import {GET_LABEL_FROM_DURATION} from 'modules/CoinLeague/utils/time';
import {GET_GAME_LEVEL} from 'modules/CoinLeague/utils/game';
import {GameGraph} from 'modules/CoinLeague/utils/types';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  icon: {
    '& > path': {
      stroke: theme.palette.text.primary,
    },
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
    fontSize: '0.8rem',
    padding: theme.spacing(1),
    justifyContent: 'space-between',
  },
  smallContent: {
    fontSize: '14px',
    paddingBottom: theme.spacing(3),
  },
}));

interface Props {
  game: GameGraph;
  onClick: (address: string) => void;
  btnMessage?: string;
}

const strPad = (str: number): string => {
  return (new Array(3).join('0') + str).slice(-2);
};

function CardTimer(props: {time: number}) {
  const time = props.time;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time / 60) - hours * 3600;
  const seconds = time - minutes * 60;

  return (
    <Grid item>
      <Typography variant='subtitle2'>
        in {strPad(hours)}:{strPad(minutes)}:{strPad(seconds)}
      </Typography>
    </Grid>
  );
}

function CardGameProgress(props: Props): JSX.Element {
  const {game, onClick} = props;
  const {chainId, coinSymbol} = useLeaguesChainInfo();
  const classes = useStyles();
  /* const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(game.amount_to_play.toNumber()  );*/
  const [countdown, setCountdown] = useState<number>();

  const entryAmount = ethers.utils.formatEther(game.entry);
  const time = Number(game.duration);
  const coins = Number(game.numCoins);

  // Format number values
  const entriesIn = strPad(Number(game.currentPlayers) || 0);
  const entriesOut = strPad(Number(game.numPlayers) || 0);

  const prizeTotalValue = ethers.utils.formatEther(
    BigNumber.from(game.entry).mul(BigNumber.from(game.currentPlayers)),
  );

  const onClickEnter = useCallback(
    (ev: any) => {
      onClick(game.intId);
    },
    [game.intId, onClick],
  );

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
  const gameLevel = GET_GAME_LEVEL(BigNumber.from(game.entry), chainId);

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Typography variant='subtitle2'>ID #{game.intId}</Typography>
      <Grid container className={classes.innerContent}>
        <Grid xs={6} item>
          <Box display={'flex'} alignItems={'center'}>
            <SendIcon />
            <Box display={'flex'} alignItems={'center'} pl={1}>
              <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                spacing={1}>
                <Grid xs={12} item>
                  <Typography
                    variant='subtitle2'
                    style={{color: '#fcc591', alignItems: 'baseline'}}>
                    {gameLevel}
                  </Typography>
                  <Typography
                    style={{color: '#fcc591', alignItems: 'baseline'}}>
                    &nbsp;{entryAmount} {coinSymbol}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid xs={6} item>
          <Box
            display={'flex'}
            justifyContent='flex-end'
            style={{color: '#7a8398'}}>
            <Typography variant='h6'>
              {' '}
              <IntlMessages id='app.coinLeagues.gameTime' />:
            </Typography>
            <Typography variant='h6' style={{fontWeight: 500}}>
              &nbsp;{GET_LABEL_FROM_DURATION(time)}
            </Typography>
          </Box>
          <Box
            display={'flex'}
            justifyContent='flex-end'
            style={{color: '#7a8398'}}>
            <Typography variant='h6'>
              &nbsp;
              <IntlMessages id='app.coinLeagues.gameType' />
              ::
            </Typography>
            <Typography
              variant='h6'
              style={{color: game.type === 'Bull' ? '#60A561' : '#F76F8E'}}>
              &nbsp; {game.type === 'Bull' ? 'Bull' : 'Bear'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        className={`${classes.innerContent} ${classes.smallContent}`}>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.countdown' />
          </Typography>
          {countdown && countdown > 0 ? (
            <CardTimer time={countdown} />
          ) : (
            <Typography variant='subtitle2'>
              <IntlMessages id='app.coinLeagues.ended' />{' '}
            </Typography>
          )}
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.entries' />{' '}
            <Typography variant='subtitle2'>
              {entriesIn}/{entriesOut}
            </Typography>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.coins' />{' '}
            <Typography variant='subtitle2'>{strPad(coins)}</Typography>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.prizePool' />{' '}
            <Typography variant='subtitle2'>
              {prizeTotalValue} {coinSymbol}
            </Typography>
          </Typography>
        </Grid>
      </Grid>

      <Button className={classes.button} fullWidth onClick={onClickEnter}>
        {props.btnMessage || 'VIEW'}
      </Button>
    </Container>
  );
}

export default CardGameProgress;
