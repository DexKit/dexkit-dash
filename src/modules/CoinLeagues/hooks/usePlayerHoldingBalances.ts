import { useNetworkProvider } from 'hooks/provider/useNetworkProvider';
import { useQuery } from 'react-query';
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { ChainId } from 'types/blockchain';
import { getPlayerMultipliers } from '../services/coinLeagues';
import { GET_LEAGUES_CHAIN_ID } from '../utils/constants';
import { useCoinLeagues } from './useCoinLeagues';
import { useLeaguesChainInfo } from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';

export const usePlayerHoldingTokenBalances = (address?: string, enable?: boolean) => {
  const { chainId } = useLeaguesChainInfo();
  const provider = useNetworkProvider(
    EthereumNetwork.matic,
    GET_LEAGUES_CHAIN_ID(chainId),
  );
  const { game } = useCoinLeagues(address);

  return useQuery(
    ['GET_LEAGUES_PLAYER_TOKEN_BALANCES', game?.players],
    async () => {
      if (!game?.players || !enable) {
        return;
      }
      return await getPlayerMultipliers(
        // @ts-ignore
        game.players,
        provider,
         // @ts-ignore
        chainId || ChainId.Matic,
      );
    },
  );
};
