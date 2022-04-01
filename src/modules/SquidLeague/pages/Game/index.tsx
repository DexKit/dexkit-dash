import Paper from '@material-ui/core/Paper';
import {useWeb3} from 'hooks/useWeb3';
import {useGameAddress} from 'modules/SquidLeague/hooks/useGameAddress';
import {useOnChainGameData} from 'modules/SquidLeague/hooks/useOnChainGameData';
import {isSupportedBlockchain} from 'modules/SquidLeague/utils/blockchain';
import React from 'react';

import {useParams} from 'react-router';
import {Empty} from 'shared/components/Empty';
import MainLayout from 'shared/components/layouts/main';

//import GameLayout from './index.layout';
import GameLayout from './index.layout';
import GameLayoutSkeleton from './index.layout.skeleton';

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
          <Paper>
            <Empty
              title='Squid League: Network not Supported'
              message='Please switch to supported networks: Mumbai'
            />
          </Paper>
        </MainLayout>
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
