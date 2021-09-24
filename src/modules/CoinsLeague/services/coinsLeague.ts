import {CallInput} from '@indexed-finance/multicall';
import {BigNumber, Contract, ContractTransaction, ethers, providers} from 'ethers';
import {Interface} from 'ethers/lib/utils';
import {getMulticall} from 'services/multicall';
import {getEthers, getProvider, getWeb3Wrapper} from 'services/web3modal';
import {CoinFeed, Game} from 'types/coinsleague';
import coinsLeagueAbi from '../../../shared/constants/ABI/coinsLeague.json';

let coinsLeague: Contract;
export const getCoinsLeagueContract = async (address: string) => {
  if (coinsLeague) {
    return coinsLeague.attach(address);
  }

  if (!coinsLeague) {
    const appProvider = getProvider();
    const provider = new providers.Web3Provider(
       appProvider 
    ).getSigner();
    coinsLeague = new ethers.Contract(address, coinsLeagueAbi, provider);
  }

  return coinsLeague;
};

/**
 * return all games data at once
 * @param games
 */
export const getGamesData = async (gamesAddress: string[]): Promise<Game[]> => {
  const iface = new Interface(coinsLeagueAbi);
  const multicall = await getMulticall();
  const calls: CallInput[] = [];
  const games: Game[] = [];
  for (let index = 0; index < gamesAddress.length; index++) {
    const addr = gamesAddress[index];
    calls.push({interface: iface, target: addr, function: 'game'});
    calls.push({interface: iface, target: addr, function: 'getPlayers'});
  }
  const response = await multicall.multiCall(calls);
  const [blockNumber, results] = response;
  for (let index = 0; index < results.length; index += 2) {
    const g = results[index];
    const players = results[index + 1];
    games.push({
      address: gamesAddress[index / 2],
      players: players,
      ...g,
    });
  }
  return games;
};

/**
 * return all coin feeds at once
 * @param games
 */
export const getCoinFeeds = async (
  feeds: string[],
  gameAddress: string,
): Promise<CoinFeed[]> => {
  const iface = new Interface(coinsLeagueAbi);
  const multicall = await getMulticall();
  const calls: CallInput[] = [];
  const coins: CoinFeed[] = [];
  for (let index = 0; index < feeds.length; index++) {
    const addr = feeds[index];
    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'coins',
      args: [addr],
    });
  }
  const response = await multicall.multiCall(calls);
  const [blockNumber, results] = response;
  for (let index = 0; index < feeds.length; index++) {
    coins.push(results[index]);
  }
  // TODO: check how the returned value is without object
  // We need to map manually to properties in order to work properly
  const mappedFeeds = coins.map((c: any) => {
    return {
      address: c[0],
      start_price: c[1],
      end_price: c[2],
      score: c[3],
    } as CoinFeed;
  });
  return mappedFeeds;
};


/**
 * return all coin feeds at once
 * @param games
 */
 export const getCurrentCoinFeedsPrice = async (
  feeds: string[],
  gameAddress: string,
): Promise<{price: BigNumber, feed: string}[]> => {
  const iface = new Interface(coinsLeagueAbi);
  const multicall = await getMulticall();
  const calls: CallInput[] = [];
  const coins: CoinFeed[] = [];
  if(feeds.length === 0){
    return [];
  }
  
  for (let index = 0; index < feeds.length; index++) {
    const addr = feeds[index];
    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'getPriceFeed',
      args: [addr],
    });
  }
  const response = await multicall.multiCall(calls);
  const [blockNumber, results] = response;
  for (let index = 0; index < feeds.length; index++) {
    coins.push(results[index]);
  }
  // TODO: check how the returned value is without object
  // We need to map manually to properties in order to work properly
  const mappedFeeds = coins.map((c: any, i) => {
    return {
     price: c,
     feed: feeds[i]
    } as {
      feed: string,
      price: BigNumber};
  });
  return mappedFeeds;
};
const GAS_PRICE_MULTIPLIER = 2;
export const joinGame = async (
  gameAddress: string,
  feeds: string[],
  amount: string,
) => {
  const ethers = getEthers()
  const gasPrice = await (await ethers?.getGasPrice())?.mul(GAS_PRICE_MULTIPLIER );
  return (await getCoinsLeagueContract(gameAddress)).joinGame(feeds, {
    value: amount,
  }) as Promise<ContractTransaction>;
};

export const startGame = async (gameAddress: string) => {
  const ethers = getEthers()
  const gasPrice = await (await ethers?.getGasPrice())?.mul(GAS_PRICE_MULTIPLIER );

  return (
    await getCoinsLeagueContract(gameAddress)
  ).startGame({gasPrice}) as Promise<ContractTransaction>;
};

export const endGame = async (gameAddress: string) => {
  const ethers = getEthers()
  const gasPrice = await (await ethers?.getGasPrice())?.mul(GAS_PRICE_MULTIPLIER);

  return (
    await getCoinsLeagueContract(gameAddress)
  ).endGame({gasPrice}) as Promise<ContractTransaction>;
};

export const claim = async (gameAddress: string) => {
  const ethers = getEthers()
  const gasPrice = await (await ethers?.getGasPrice())?.mul(GAS_PRICE_MULTIPLIER );

  return (
    await getCoinsLeagueContract(gameAddress)
  ).claim({gasPrice}) as Promise<ContractTransaction>;
};

export const abortGame = async (gameAddress: string) => {
  const ethers = getEthers()
  const gasPrice = await (await ethers?.getGasPrice())?.mul(GAS_PRICE_MULTIPLIER );
  return (
    await getCoinsLeagueContract(gameAddress)
  ).abortGame({gasPrice}) as Promise<ContractTransaction>;
};

export const withdrawGame = async (gameAddress: string) => {
  const ethers = getEthers()
  const gasPrice = await (await ethers?.getGasPrice())?.mul(GAS_PRICE_MULTIPLIER );
  return (
    await getCoinsLeagueContract(gameAddress)
  ).withdraw({gasPrice}) as Promise<ContractTransaction>;
};

export const getWinner = async (gameAddress: string, account: string) => {
  return (await getCoinsLeagueContract(gameAddress)).winners(account);
};
