import React, {useMemo} from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import {useCountdown} from 'hooks/utils/useCountdown';
import {makeStyles} from '@material-ui/core/styles';
import {useCoinLeagues} from 'modules/CoinLeagues/hooks/useCoinLeagues';
import {strPad} from 'modules/CoinLeagues/utils/time';

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
  id: string;
}

function CardTimer(props: {time: number}) {
  const time = props.time;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = time - hours * 3600 - minutes * 60;
  return (
    <Grid item>
      <Typography variant='h6'>
        {strPad(hours)}:{strPad(minutes)}:{strPad(seconds)}
      </Typography>
    </Grid>
  );
}

function CountdownStartsAt(props: Props): JSX.Element {
  const classes = useStyles();
  const {game, refetch } = useCoinLeagues(props.id);
  const startTimestamp = game?.start_timestamp.toNumber();

  const endTime = useMemo(() => {
    if (game  && startTimestamp) {
      return new Date(startTimestamp * 1000);
    }
    return new Date();
  }, [ startTimestamp, game]);

  const count = useCountdown(endTime, {
    interval: 1000,
    onEnd: () => refetch(),
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
           Countdown to Start
          </Typography>
          <Typography variant='h4' style={{color: '#fff'}}>
            <CardTimer time={count} />
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CountdownStartsAt;
