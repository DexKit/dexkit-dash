import React, {useMemo} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

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
    <>
      {strPad(hours)}:{strPad(minutes)}:{strPad(seconds)}
    </>
  );
}

function Countdown(props: Props): JSX.Element {
  const classes = useStyles();
  const {game, refetch, refetchCurrentFeeds} = useCoinLeagues(props.id);
  const duration = game?.duration.toNumber();
  const startTimestamp = game?.start_timestamp.toNumber();

  const endTime = useMemo(() => {
    if (game && duration && startTimestamp) {
      const time = duration;
      return new Date(time * 1000 + startTimestamp * 1000);
    }
    return new Date();
  }, [duration, startTimestamp, game]);

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

  return <CardTimer time={count} />;
}

export default Countdown;
