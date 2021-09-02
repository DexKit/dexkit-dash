import {CallInput} from '@indexed-finance/multicall';
import {Contract, ContractTransaction, ethers, providers} from 'ethers';
import {Interface} from 'ethers/lib/utils';
import {CoinFeed, Game, GameParams} from 'types/coinsleague';
import coinsLeagueFactoryAbi from '../../../shared/constants/ABI/coinsLeagueFactory.json';
import {getMulticall} from '../../../services/multicall';
import {getWeb3Wrapper} from '../../../services/web3modal';

export const COINS_LEAGUE_FACTORY_ADDRESS = {
  MUMBAI: '0xa1B3a09D5f83a52085fd37becb229038bCeacFf3',
};

let coinsLeagueFactory: Contract;
export const getCoinsLeagueFactoryContract = async (address: string) => {
  if (!coinsLeagueFactory) {
    const web3Wrapper = await getWeb3Wrapper();
    //@ts-ignore
    const provider = new providers.Web3Provider(web3Wrapper.getProvider());

    coinsLeagueFactory = new ethers.Contract(
      address,
      coinsLeagueFactoryAbi,
      provider,
    );
  }
  return coinsLeagueFactory;
};

export const createGame = async (address: string, params: GameParams) => {
  return (await getCoinsLeagueFactoryContract(address)).createGame(
    params.numPlayers,
    params.duration,
    params.amountUnit,
    params.numCoins,
    params.abortTimestamp,
  ) as Promise<ContractTransaction>;
};

export const getGamesAddressFromFactory = async (
  factoryAddress: string,
  maxGames: number,
) => {
  const iface = new Interface(coinsLeagueFactoryAbi);
  const multicall = await getMulticall();
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: factoryAddress,
    function: 'totalGames',
  });
  const [, totalGames] = await multicall.multiCall(calls);
  const total = totalGames[0] ? totalGames[0].toNumber() : 0
  const start = total-maxGames <= 0 ? 0 : total-maxGames

  calls = [];
  calls.push({
    interface: iface,
    target: factoryAddress,
    function: 'getGames',
    args: [start, maxGames],
  });
  const [, gamesAddress] = await multicall.multiCall(calls);
  return [gamesAddress[0], total];
};
