import { useWeb3 } from 'hooks/useWeb3';
import { useQuery } from 'react-query';
import { ChainId, Web3State } from 'types/blockchain';
import { SQUID_LEAGUE_FACTORY_ADDRESS } from '../constants';
import { getGameAddress } from '../services/squidGameFactory';

export const useGameAddress = (id?: string) => {
    const { web3State, account, getProvider, chainId } = useWeb3();

    const gameQuery = useQuery(
        ['GET_SQUID_LEAGUE_GAME_ADDRESS', account, chainId, id],
        () => {
            if (!account || web3State !== Web3State.Done || !chainId || !id) {
                return;
            }
            const provider = getProvider();
            const gameAddress =
                SQUID_LEAGUE_FACTORY_ADDRESS[chainId as ChainId.Mumbai];

            return getGameAddress(id, gameAddress, provider);
        },
    );

    return gameQuery;
};
