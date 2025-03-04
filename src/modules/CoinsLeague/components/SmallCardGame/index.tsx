import React, {useCallback, useState} from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import {ethers} from 'ethers';
import {makeStyles} from '@material-ui/core/styles';
import {truncateAddress} from 'utils/text';
import {ReactComponent as SendIcon} from 'assets/images/icons/send-square.svg';

import {useInterval} from 'hooks/utils/useInterval';

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

interface Props {
  address: string;
  amount_to_play: ethers.BigNumber;
  start_timestamp: ethers.BigNumber;
  duration: ethers.BigNumber;
  num_players: number;
  btnMessage?: string;
  onClick: any;
}

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

function SmallCardGame(props: Props): JSX.Element {
  const {
    amount_to_play,
    start_timestamp,
    num_players,
    duration,
    address,
    onClick,
  } = props;

  const classes = useStyles();

  const [countdown, setCountdown] = useState<number>();
  /* const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.prizePool);*/

  const prizeTotalValue = ethers.utils.formatEther(
    amount_to_play.mul(num_players),
  );
  const entryAmount = ethers.utils.formatEther(amount_to_play);
  useInterval(
    () => {
      const time = duration.toNumber();
      const startTime =
        Math.round(new Date().getTime() / 1000) - start_timestamp.toNumber();
      setCountdown(time - startTime);
    },
    1000,
    true,
  );

  const onClickEnter = useCallback(
    (ev: any) => {
      onClick(address);
    },
    [address],
  );

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Typography variant='h5'>ID #{truncateAddress(address)}</Typography>
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
              &nbsp;{entryAmount} {'Matic'}
            </Typography>
          </Grid>

          <Grid container>
            <Typography variant='h6'>Prize Pool:&nbsp;</Typography>
            <Typography variant='h6'>{prizeTotalValue} Matic</Typography>
          </Grid>

          <Grid container style={{color: '#7a8398'}}>
            <Typography variant='h6'>Countdown:&nbsp;</Typography>
            <Typography variant='h6' style={{fontWeight: 600}}>
              {countdown && countdown > 0 && <CardTimer time={countdown} />}
              {countdown && countdown < 0 && 'ENDED'}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Button className={classes.button} fullWidth onClick={onClickEnter}>
        {props.btnMessage || 'VIEW'}
      </Button>
    </Container>
  );
}

export default SmallCardGame;
