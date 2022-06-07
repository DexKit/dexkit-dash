import React from 'react';

import {strPad} from 'modules/CoinLeague/utils/time';

export function CardTimer(props: {time: number}) {
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
