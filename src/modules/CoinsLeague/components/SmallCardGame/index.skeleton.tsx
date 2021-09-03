import React from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';
import {truncateAddress} from 'utils/text';
import {ReactComponent as SendIcon} from 'assets/images/icons/send-square.svg';
import Skeleton from '@material-ui/lab/Skeleton';
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
}));

const strPad = (str: number): string =>
  (new Array(3).join('0') + str).slice(-2);

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

function SmallCardGameSkeleton(): JSX.Element {
  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Skeleton>
        <Typography variant='h5'>
          ID #{truncateAddress('0x0000000000000000000000000000000000')}
        </Typography>
      </Skeleton>
      <Grid container className={classes.innerContent}>
        <Grid item>
          <Grid container>
            <Typography
              variant='h6'
              style={{
                fontWeight: 500,
                color: '#fcc591',
                alignItems: 'baseline',
              }}>
              <SendIcon />
              <Skeleton>
                &nbsp;{0} {'Matic'}
              </Skeleton>
            </Typography>
          </Grid>

          <Grid container>
            <Typography variant='h6'>Prize Pool:&nbsp;</Typography>
            <Skeleton>
              <Typography variant='h6'>{1000} Matic</Typography>
            </Skeleton>
          </Grid>

          <Grid container style={{color: '#7a8398'}}>
            <Typography variant='h6'>Countdown:&nbsp;</Typography>
            <Typography variant='h6' style={{fontWeight: 600}}>
              <Skeleton>
                <CardTimer time={1000} />
              </Skeleton>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Skeleton>
        <Button className={classes.button} fullWidth>
          {'VIEW'}
        </Button>
      </Skeleton>
    </Container>
  );
}

export default SmallCardGameSkeleton;
