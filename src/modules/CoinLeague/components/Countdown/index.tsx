import React, {useMemo} from 'react';

import {useCountdown} from 'hooks/utils/useCountdown';
import {useCoinLeagues} from 'modules/CoinLeague/hooks/useCoinLeagues';
import {strPad} from 'modules/CoinLeague/utils/time';

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
