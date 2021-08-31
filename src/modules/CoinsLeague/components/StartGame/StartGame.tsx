import React from 'react';
import {useCoinsLeague} from 'modules/CoinsLeague/hooks/useCoinsLeague';

interface Props {
  address?: string;
}

export const StartGame = (props: Props) => {
  const {address} = props;
  const {onStartGameCallback} = useCoinsLeague(address);

  return (
    <>
      <h1> Start Game</h1>
      <button onClick={onStartGameCallback}>Start</button>
    </>
  );
};
