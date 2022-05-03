import {ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';
import {Web3State} from 'types/blockchain';
import {GET_NFT_LEAGUE_FACTORY_ADDRESS} from '../constants';
import battleFactoryAbi from '../constants/ABI/BattleNFTFactory.json';
import {Game} from '../utils/types';

const GET_GAME_ONCHAIN = 'GET_GAME_ONCHAIN';

export function useGameOnChain(id: string) {
  const {getProvider, chainId, web3State} = useWeb3();

  return useQuery(
    [GET_GAME_ONCHAIN, id, chainId, web3State],
    async (): Promise<Game | undefined> => {
      if (web3State !== Web3State.Done || !chainId) {
        return;
      }

      const provider = getProvider();

      const contract = new ethers.Contract(
        GET_NFT_LEAGUE_FACTORY_ADDRESS(chainId),
        battleFactoryAbi,
        new ethers.providers.Web3Provider(provider),
      );

      const game = await contract.allGames(id);

      const coin_player1 = await contract.coin_player1(id);

      const coin_player2 = await contract.coin_player2(id);

      const gameData: Game = {
        id: game['id'],
        aborted: game['aborted'],
        claimed: game['claimed'],
        duration: game['duration'],
        game_type: game['game_type'],
        started: game['started'],
        withdrawed: game['withdrawed'],
        entry: game['entry'],
        finished: game['finished'],
        player1: game['player1'],
        player2: game['player2'],
        start_timestamp: game['start_timestamp'],
        winner: game['winner'],
        player1_coin: {
          coin_feed: coin_player1['coin_feed'],
          champion_id: coin_player1['champion_id'],
          multiplier: coin_player1['multiplier'],
          start_price: coin_player1['start_price'],
          end_price: coin_player1['end_price'],
          score: coin_player1['score'],
          champion_score: coin_player1['champion_score'],
        },
        player2_coin: {
          coin_feed: coin_player2['coin_feed'],
          champion_id: coin_player2['champion_id'],
          multiplier: coin_player2['multiplier'],
          start_price: coin_player2['start_price'],
          end_price: coin_player2['end_price'],
          score: coin_player2['score'],
          champion_score: coin_player2['champion_score'],
        },
      };

      return gameData;
    },
  );
}
