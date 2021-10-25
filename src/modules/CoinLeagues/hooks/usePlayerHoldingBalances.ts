import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {useQuery} from 'react-query';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {getPlayerMultipliers} from '../services/coinLeagues';
import {useCoinLeagues} from './useCoinLeagues';

export const usePlayerHoldingTokenBalances = (address?: string) => {
  const networkProvider = useNetworkProvider(EthereumNetwork.matic);
  const {game} = useCoinLeagues(address);

  return useQuery(
    ['GET_LEAGUES_PLAYER_TOKEN_BALANCES', game?.players],
    async () => {
      if (!game?.players) {
        return;
      }
      return await getPlayerMultipliers(
        // @ts-ignore
        game.players.map((p) => p[1]),
        networkProvider,
      );
    },
  );
};
