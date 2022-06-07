import React, {useMemo} from 'react';

import {useCountdown} from 'hooks/utils/useCountdown';

import {strPad} from 'modules/CoinLeague/utils/time';

interface Props {
  duration?: number;
  startTimestamp: number;
  onEndCallback?: Function;
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
  const {duration, startTimestamp, onEndCallback} = props;
  const endTime = useMemo(() => {
    if (duration && startTimestamp) {
      return new Date(duration * 1000 + startTimestamp * 1000);
    }
    if (startTimestamp) {
      return new Date(startTimestamp * 1000);
    }

    return new Date();
  }, [duration, startTimestamp]);

  const count = useCountdown(endTime, {
    interval: 1000,
    onEnd: onEndCallback,
  });

  return <CardTimer time={count} />;
}

export default Countdown;
