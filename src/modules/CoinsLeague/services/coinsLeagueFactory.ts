import {CallInput} from '@indexed-finance/multicall';
import {Contract, ContractTransaction, ethers, providers} from 'ethers';
import {Interface} from 'ethers/lib/utils';
import {GameParams} from 'types/coinsleague';
import coinsLeagueFactoryAbi from '../../../shared/constants/ABI/coinsLeagueFactory.json';
import {getMulticall} from '../../../services/multicall';
import {getWeb3Wrapper} from '../../../services/web3modal';
// 0xA9f159D887745264aFe3C0Ba43BEad4255Af34E9
//0x1539ffBa6D1c63255dD9F61627c8B4a855E82F2a
export const COINS_LEAGUE_FACTORY_ADDRESS = {
  MUMBAI: '0x7560E5Ee0734B59E7D1D8508c39AF744256e8509',
};

let coinsLeagueFactory: Contract;
export const getCoinsLeagueFactoryContract = async (address: string) => {
  if (!coinsLeagueFactory) {
    const web3Wrapper = await getWeb3Wrapper();
    //@ts-ignore
    const provider = new providers.Web3Provider(
      //@ts-ignore
      web3Wrapper.getProvider(),
    ).getSigner();

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
): Promise<[string[], number]> => {
  const iface = new Interface(coinsLeagueFactoryAbi);
  const multicall = await getMulticall();
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: factoryAddress,
    function: 'totalGames',
  });
  const [, totalGames] = await multicall.multiCall(calls);
  const total = totalGames[0] ? totalGames[0].toNumber() : 0;
  const start = total - maxGames <= 0 ? 0 : total - maxGames;
  calls = [];
  /* calls.push({
    interface: iface,
    target: factoryAddress,
    function: 'getGames',
    args:  [0, 1],
  });*/

  for (let index = 0; index < total; index++) {
    calls.push({
      interface: iface,
      target: factoryAddress,
      function: 'coinsLeague',
      args: [index],
    });
  }
  if (calls.length) {
    const [, gamesAddress] = await multicall.multiCall(calls);
    return [gamesAddress as string[], total as number];
  } else {
    return [[], total as number];
  }
};
