import React from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';

import SendIcon from 'assets/images/icons/send-square.svg';

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
  id: number;
  time: number;
  coins: number;
  startsIn: number;
  prizePool: number;
  btnMessage?: string;
  entries: {in: number; out: number};
  value: {qty: number; coin?: string};
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

function CardGame(props: Props): JSX.Element {
  const classes = useStyles();

  const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.prizePool);

  // Format number values
  const entriesIn = strPad(props.entries.in || 0);
  const entriesOut = strPad(props.entries.out || 0);

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Typography variant='h5'>ID #{props.id}</Typography>
      <Grid container className={classes.innerContent}>
        <Grid xs={5} item>
          <Typography
            variant='h6'
            style={{color: '#fcc591', alignItems: 'baseline'}}>
            <SendIcon />
            &nbsp;{props.value?.qty} {props.value?.coin || 'ETH'}
          </Typography>
        </Grid>
        <Grid
          xs={7}
          container
          justifyContent='flex-end'
          style={{color: '#7a8398'}}>
          <Typography variant='h6'>Game Time:</Typography>
          <Typography variant='h6' style={{fontWeight: 600}}>
            &nbsp;{Math.floor(props.time / 3600)}Hrs
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        className={`${classes.innerContent} ${classes.smallContent}`}>
        <Grid item>
          <Typography variant='subtitle2'>
            Starts
            <CardTimer time={props.time} />
          </Typography>
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
            <Typography variant='subtitle2'>{strPad(props.coins)}</Typography>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            Prize Pool
            <Typography variant='subtitle2'>{value}</Typography>
          </Typography>
        </Grid>
      </Grid>

      <Button className={classes.button} fullWidth>
        {props.btnMessage || 'ENTER THE GAME'}
      </Button>
    </Container>
  );
}

export default CardGame;
