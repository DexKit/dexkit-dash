import { useWeb3 } from 'hooks/useWeb3';
import { useQuery } from 'react-query';
import { ChainId, Web3State } from 'types/blockchain';
import { SQUID_LEAGUE_FACTORY_ADDRESS } from '../constants';

import { getLastGameId } from '../services/squidGameFactory';

export const useLastGameId = () => {
    const { web3State, getProvider, chainId } = useWeb3();

    return useQuery(
        ['GET_SQUID_LEAGUE_LAST_GAME_ID', chainId],
        async () => {
            if (web3State !== Web3State.Done || !chainId) {
                return;
            }
            const gameAddress = SQUID_LEAGUE_FACTORY_ADDRESS[chainId as ChainId.Mumbai];
            const provider = getProvider();
            const lastId = await getLastGameId(gameAddress, provider);
            return lastId - 1;
        },
    );


};
