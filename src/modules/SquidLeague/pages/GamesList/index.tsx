import {useLastGameId} from 'modules/SquidLeague/hooks/useLastGameId';
import React from 'react';
import GameLayout from '../Game/index.layout';
import GameLayoutSkeleton from '../Game/index.layout.skeleton';

const GamesList = () => {
  const lastGameIdQuery = useLastGameId();
  return (
    <>
      {lastGameIdQuery.isLoading && <GameLayoutSkeleton />}

      {typeof lastGameIdQuery.data !== undefined && (
        <GameLayout id={String(lastGameIdQuery.data)} />
      )}
    </>
  );
};

export default GamesList;
