import {useWeb3} from 'hooks/useWeb3';
import {Title} from 'modules/SquidLeague/components/Title';
import {SQUID_LEAGUE_SUPPORTED_NETWORKS} from 'modules/SquidLeague/constants';
import {useGameAddress} from 'modules/SquidLeague/hooks/useGameAddress';
import {useOnChainGameData} from 'modules/SquidLeague/hooks/useOnChainGameData';
import {isSupportedBlockchain} from 'modules/SquidLeague/utils/blockchain';
import React from 'react';

import {useParams} from 'react-router';
import {Empty} from 'shared/components/Empty';
import MainLayout from 'shared/components/layouts/main';
import NetworkSupportCard from 'shared/components/NetworkSupportCard';

//import GameLayout from './index.layout';
import GameLayout from './index.layout';

interface Params {
  id: string;
}

export const Game = () => {
  const {id} = useParams<Params>();
  const gameAddressQuery = useGameAddress(id);
  const {chainId} = useWeb3();
  const gameDataQuery = useOnChainGameData(gameAddressQuery.data);

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

      {gameDataQuery.isError && isSupportedBlockchain(chainId) && (
        <MainLayout>
          <Title />
          <Empty
            title='Squid League: Error '
            message='Error fetching game, please reload page'
          />
        </MainLayout>
      )}

      {isSupportedBlockchain(chainId) && gameDataQuery.isSuccess && (
        <GameLayout id={id} />
      )}
    </>
  );
};

export default Game;
