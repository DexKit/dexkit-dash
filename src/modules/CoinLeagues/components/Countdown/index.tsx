import React, {useMemo} from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import {useCountdown} from 'hooks/utils/useCountdown';
import {makeStyles} from '@material-ui/core/styles';
import {useCoinLeagues} from 'modules/CoinLeagues/hooks/useCoinLeagues';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  innerContent: {
    padding: theme.spacing(1),
    justifyContent: 'space-between',
    fontSize: '1rem',
  },
}));

interface Props {
  address: string;
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

function Countdown(props: Props): JSX.Element {
  const classes = useStyles();
  const {game, refetch, refetchCurrentFeeds} = useCoinLeagues(props.address);
  const endTime = useMemo(() => {
    if (game) {
      const time = game?.duration.toNumber();
      return new Date(time*1000 + game?.start_timestamp.toNumber()*1000)
    }
    return new Date();
  }, [game?.duration, game?.start_timestamp]);

  const count = useCountdown(endTime, {
    interval: 1000,
    onEnd: () => refetch(),
  });
  //TODO: Check if this is the best place to refresh data
  useCountdown(endTime, {
    interval: 10000,
    onDown: () => refetchCurrentFeeds(),
  });
  /*const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.prizePool);*/

  return (
    <Container className={classes.container}>
      <Grid container className={classes.innerContent}>
        <Grid item>
          <Typography variant='subtitle2' style={{color: '#7A8398'}}>
            Countdown
          </Typography>
          <Typography variant='h4' style={{color: '#fff'}}>
            <CardTimer time={count} />
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Countdown;
