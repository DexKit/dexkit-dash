import {Paper} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useLastGameId} from 'modules/SquidLeague/hooks/useLastGameId';
import {isSupportedBlockchain} from 'modules/SquidLeague/utils/blockchain';
import React from 'react';
import {Empty} from 'shared/components/Empty';
import MainLayout from 'shared/components/layouts/main';
import GameLayout from '../Game/index.layout';
import GameLayoutSkeleton from '../Game/index.layout.skeleton';

const GamesList = () => {
  const {chainId} = useWeb3();
  const lastGameIdQuery = useLastGameId();
  return (
    <>
      {lastGameIdQuery.isLoading && isSupportedBlockchain(chainId) && (
        <GameLayoutSkeleton />
      )}
      {!isSupportedBlockchain(chainId) && (
        <MainLayout>
          <Paper>
            <Empty
              title='Squid League: Network not Supported'
              message='Please switch to supported networks: Mumbai'
            />
          </Paper>
        </MainLayout>
      )}

      {lastGameIdQuery.isError && (
        <MainLayout>
          <Paper>
            <Empty
              title='Squid League: Error '
              message='Error fetching game, please reload page'
            />
          </Paper>
        </MainLayout>
      )}

      {lastGameIdQuery.isSuccess && isSupportedBlockchain(chainId) && (
        <GameLayout id={String(lastGameIdQuery.data)} />
      )}
    </>
  );
};

export default GamesList;
