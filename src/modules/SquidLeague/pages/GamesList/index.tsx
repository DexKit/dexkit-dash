import {useWeb3} from 'hooks/useWeb3';
import {Title} from 'modules/SquidLeague/components/Title';
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
        <MainLayout>
          <Title />
          <NetworkSupportCard
            supportedChains={SQUID_LEAGUE_SUPPORTED_NETWORKS}
          />
        </MainLayout>
      )}
      {lastGameIdQuery.isError && isSupportedBlockchain(chainId) && (
        <MainLayout>
          <Title />
          <Empty
            title='Squid League: Error '
            message='Error fetching game, please reload page'
          />
        </MainLayout>
      )}
      {lastGameIdQuery.isSuccess && isSupportedBlockchain(chainId) && (
        <GameLayout id={String(lastGameIdQuery.data)} />
      )}
    </>
  );
};

export default GamesList;
