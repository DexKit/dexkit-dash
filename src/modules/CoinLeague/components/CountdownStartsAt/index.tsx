import React, {useMemo} from 'react';

import {useCountdown} from 'hooks/utils/useCountdown';
import {useCoinLeagues} from 'modules/CoinLeague/hooks/useCoinLeagues';
import {strPad} from 'modules/CoinLeague/utils/time';

interface Props {
  id: string;
}

function CardTimerUnstyled(props: {time: number}) {
  const time = props.time;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = time - hours * 3600 - minutes * 60;

  return (
    <span>
      {strPad(hours)}:{strPad(minutes)}:{strPad(seconds)}
    </span>
  );
}

function CountdownStartsAt(props: Props): JSX.Element {
  const {game, refetch} = useCoinLeagues(props.id);
  const startTimestamp = game?.start_timestamp.toNumber();

  const endTime = useMemo(() => {
    if (game && startTimestamp) {
      return new Date(startTimestamp * 1000);
    }
    return new Date();
  }, [startTimestamp, game]);

  const count = useCountdown(endTime, {
    interval: 1000,
    onEnd: () => refetch(),
  });

  return <CardTimerUnstyled time={count} />;
}

export default CountdownStartsAt;
