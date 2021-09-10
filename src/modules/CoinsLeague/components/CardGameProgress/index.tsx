import React, {useCallback, useState} from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';

import {ReactComponent as SendIcon} from 'assets/images/icons/send-square.svg';
import {Game} from 'types/coinsleague';
import {ethers} from 'ethers';
import {truncateAddress} from 'utils/text';
import {useInterval} from 'hooks/utils/useInterval';

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
    fontSize: '1.125rem',
    background: '#ffa552',
    justifyContent: 'center',
    padding: theme.spacing(1),
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
  game: Game;
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
  const classes = useStyles();
  /* const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(game.amount_to_play.toNumber()  );*/
  const [countdown, setCountdown] = useState<number>();
  const prizeTotalValue = ethers.utils.formatEther(
    game.amount_to_play.mul(game.num_players),
  );
  const entryAmount = ethers.utils.formatEther(game.amount_to_play);
  const time = game.duration.toNumber();
  const coins = game.num_coins;

  // Format number values
  const entriesIn = strPad(game.players.length || 0);
  const entriesOut = strPad(game.num_players || 0);
  const onClickEnter = useCallback(
    (ev: any) => {
      onClick(game.address);
    },
    [game.address],
  );

  useInterval(
    () => {
      const time = game.duration.toNumber();
      const startTime =
        Math.round(new Date().getTime() / 1000) -
        game.start_timestamp.toNumber();
      setCountdown(time - startTime);
    },
    1000,
    true,
  );

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Typography variant='h5'>ID #{truncateAddress(game.address)}</Typography>
      <Grid container className={classes.innerContent}>
        <Grid xs={6} item>
          <Grid container alignContent={'center'}>
            <SendIcon />
            <Typography
              variant='h6'
              style={{color: '#fcc591', alignItems: 'baseline'}}>
              &nbsp;{entryAmount} {'MATIC'}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          xs={6}
          container
          justifyContent='flex-end'
          style={{color: '#7a8398'}}>
          <Typography variant='h6'>Game Time:</Typography>
          <Typography variant='h6' style={{fontWeight: 600}}>
            &nbsp;{Math.floor(time / 3600)}Hrs
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

export default CardGameProgress;
