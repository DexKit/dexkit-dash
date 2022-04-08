import Paper from '@material-ui/core/Paper';
import {useWeb3} from 'hooks/useWeb3';
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

  console.log(chainId);

  return (
    <>
      {!isSupportedBlockchain(chainId) && (
        <NetworkSupportCard supportedChains={SQUID_LEAGUE_SUPPORTED_NETWORKS} />
      )}

      {gameDataQuery.isError && (
        <MainLayout>
          <Paper>
            <Empty
              title='Squid League: Error '
              message='Error fetching game, please reload page'
            />
          </Paper>
        </MainLayout>
      )}

      {isSupportedBlockchain(chainId) && gameDataQuery.isSuccess && (
        <GameLayout id={id} />
      )}
    </>
  );
};

export default Game;
