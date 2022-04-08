import {Paper} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {SQUID_LEAGUE_SUPPORTED_NETWORKS} from 'modules/SquidLeague/constants';
import {useLastGameId} from 'modules/SquidLeague/hooks/useLastGameId';
import {isSupportedBlockchain} from 'modules/SquidLeague/utils/blockchain';
import React from 'react';
import {Empty} from 'shared/components/Empty';
import MainLayout from 'shared/components/layouts/main';
import NetworkSupportCard from 'shared/components/NetworkSupportCard';
import GameLayout from '../Game/index.layout';

const GamesList = () => {
  const {chainId} = useWeb3();
  const lastGameIdQuery = useLastGameId();

  return (
    <>
      {!isSupportedBlockchain(chainId) && (
        <NetworkSupportCard supportedChains={SQUID_LEAGUE_SUPPORTED_NETWORKS} />
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
