import React, {useCallback, useState} from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import {ReactComponent as SendIcon} from 'assets/images/icons/send-square-small.svg';
import {BigNumber, ethers} from 'ethers';
import {truncateAddress} from 'utils/text';
import {useInterval} from 'hooks/utils/useInterval';
import {GET_LABEL_FROM_DURATION} from 'modules/CoinLeagues/utils/time';
import {GET_GAME_LEVEL} from 'modules/CoinLeagues/utils/game';
import {GameGraph} from 'modules/CoinLeagues/utils/types';
const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  button: {
    fontWeight: 600,
    borderRadius: 6,
    fontSize: '1.0rem',
    background: '#ffa552',
    justifyContent: 'center',
    padding: theme.spacing(1),
    color: 'black',
  },
  innerContent: {
    fontSize: '1rem',
    padding: theme.spacing(1),
    justifyContent: 'space-between',
  },
  smallContent: {
    fontSize: '0.875rem',
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

function CardGameProgressV2(props: Props): JSX.Element {
  const {game, onClick} = props;
  const classes = useStyles();
  /* const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(game.amount_to_play.toNumber()  );*/
  const [countdown, setCountdown] = useState<number>();
  const prizeTotalValue = ethers.utils.formatEther(
    BigNumber.from(game.entry).mul(BigNumber.from(game.numPlayers)),
  );
  const entryAmount = ethers.utils.formatEther(game.entry);
  const time = Number(game.duration);
  const coins = Number(game.numCoins);

  // Format number values
  const entriesIn = strPad(Number(game.currentPlayers) || 0);
  const entriesOut = strPad(Number(game.numPlayers) || 0);
  const onClickEnter = useCallback(
    (ev: any) => {
      onClick(game.id);
    },
    [game.id, onClick],
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
  const gameLevel = GET_GAME_LEVEL(BigNumber.from(game.entry));

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Typography variant='h6'>ID #{game.intId}</Typography>
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
                    variant='h6'
                    style={{color: '#fcc591', alignItems: 'baseline'}}>
                    {gameLevel}
                  </Typography>
                  <Typography
                    style={{color: '#fcc591', alignItems: 'baseline'}}>
                    &nbsp;{entryAmount} {'MATIC'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid
          xs={6}
          container
          justifyContent='flex-end'
          style={{color: '#7a8398'}}>
          <Typography variant='h6'>Duration:</Typography>
          <Typography variant='h6' style={{fontWeight: 500}}>
            &nbsp;{GET_LABEL_FROM_DURATION(time)}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        className={`${classes.innerContent} ${classes.smallContent}`}>
        <Grid item>
          <Typography variant='subtitle2'>Countdown</Typography>
          {countdown && countdown > 0 ? (
            <CardTimer time={countdown} />
          ) : (
            <Typography variant='subtitle2'>Ended </Typography>
          )}
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            Entries
            <Typography variant='subtitle2'>
              {entriesIn}/{entriesOut}
            </Typography>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            Coins
            <Typography variant='subtitle2'>{strPad(coins)}</Typography>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            Prize Pool
            <Typography variant='subtitle2'>{prizeTotalValue} MATIC</Typography>
          </Typography>
        </Grid>
      </Grid>

      <Button className={classes.button} fullWidth onClick={onClickEnter}>
        {props.btnMessage || 'VIEW'}
      </Button>
    </Container>
  );
}

export default CardGameProgressV2;
