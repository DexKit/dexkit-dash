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
    width: '66.66%',
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
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    justifyContent: 'space-between',
  },
  smallContent: {
    fontSize: '0.875rem',
    paddingBottom: theme.spacing(3),
  },
}));

interface Props {
  id: number;
  startsIn: number;
  prizePool: number;
  btnMessage?: string;
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
      <Typography variant='h6'>
        {strPad(hours)}:{strPad(minutes)}:{strPad(seconds)}
      </Typography>
    </Grid>
  );
}

function SmallCardGame(props: Props): JSX.Element {
  const classes = useStyles();

  const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.prizePool);

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Typography variant='h5'>ID #{props.id}</Typography>
      <Grid container className={classes.innerContent}>
        <Grid item>
          <Grid container>
            <Typography
              variant='h6'
              style={{
                fontWeight: 600,
                color: '#fcc591',
                alignItems: 'baseline',
              }}>
              <SendIcon />
              &nbsp;{props.value?.qty} {props.value?.coin || 'ETH'}
            </Typography>
          </Grid>

          <Grid container>
            <Typography variant='h6'>Prize Pool:&nbsp;</Typography>
            <Typography variant='h6'>{value}</Typography>
          </Grid>

          <Grid container style={{color: '#7a8398'}}>
            <Typography variant='h6'>Countdown:&nbsp;</Typography>
            <Typography variant='h6' style={{fontWeight: 600}}>
              <CardTimer time={props.startsIn} />
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Button className={classes.button} fullWidth>
        {props.btnMessage || 'VIEW'}
      </Button>
    </Container>
  );
}

export default SmallCardGame;
