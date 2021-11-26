import {CallInput} from '@indexed-finance/multicall';
import {BigNumber, ContractTransaction, ethers, providers} from 'ethers';
import {Interface} from 'ethers/lib/utils';
import {getMulticallFromProvider} from 'services/multicall';
import {getEthers} from 'services/web3modal';
import {CoinFeed, Game} from 'types/coinsleague';
import coinLeaguesAbi from '../constants/ABI/coinLeagues.json';
import erc20Abi from 'shared/constants/ABI/erc20.json';
import {BITTOKEN, DEXKIT} from 'shared/constants/tokens';
import {ChainId} from 'types/blockchain';
import {Token} from 'types/app';
import {
  DEXKIT_MULTIPLIER_HOLDING,
  BITTOKEN_MULTIPLIER_HOLDING,
} from '../constants';

export const getCoinLeaguesContract = async (
  address: string,
  provider: any,
) => {
  const pr = new providers.Web3Provider(provider).getSigner();
  return new ethers.Contract(address, coinLeaguesAbi, pr);
};

/**
 * return all games data at once
 * @param games
 */
export const getGamesData = async (
  gamesAddress: string[],
  provider: any,
): Promise<Game[]> => {
  const iface = new Interface(coinLeaguesAbi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];
  const games: Game[] = [];
  for (let index = 0; index < gamesAddress.length; index++) {
    const addr = gamesAddress[index];
    calls.push({interface: iface, target: addr, function: 'game'});
    calls.push({interface: iface, target: addr, function: 'id'});
    calls.push({interface: iface, target: addr, function: 'getPlayers'});
  }
  const response = await multicall.multiCall(calls);
  const [, results] = response;
  for (let index = 0; index < results.length; index += 3) {
    const g = results[index];
    const id = results[index + 1];
    const players = results[index + 2];
    games.push({
      address: gamesAddress[index / 3],
      players: players,
      ...g,
      id,
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
  provider: any,
): Promise<CoinFeed[]> => {
  const iface = new Interface(coinLeaguesAbi);
  const multicall = await getMulticallFromProvider(provider);
  let calls: CallInput[] = [];
  const coins: CoinFeed[] = [];
  const maxFeeds = 30;
  const totalPerFeeds = Math.ceil(feeds.length / maxFeeds);
  const totalFeeds = feeds.length;
  for (let ind = 0; ind < totalPerFeeds; ind++) {
    for (let index = ind * maxFeeds; index < (ind + 1) * maxFeeds; index++) {
      if (index >= totalFeeds) {
        break;
      }
      const addr = feeds[index];
      calls.push({
        interface: iface,
        target: gameAddress,
        function: 'coins',
        args: [addr],
      });
    }
    const response = await multicall.multiCall(calls);
    const [, results] = response;
    for (let index = 0; index < results.length; index++) {
      coins.push(results[index]);
    }
    calls = [];
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
  provider: any,
): Promise<{price: BigNumber; feed: string}[]> => {
  const iface = new Interface(coinLeaguesAbi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];
  const coins: CoinFeed[] = [];
  if (feeds.length === 0) {
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
  const [, results] = response;
  for (let index = 0; index < feeds.length; index++) {
    coins.push(results[index]);
  }
  // TODO: check how the returned value is without object
  // We need to map manually to properties in order to work properly
  const mappedFeeds = coins.map((c: any, i) => {
    return {
      price: c,
      feed: feeds[i],
    } as {
      feed: string;
      price: BigNumber;
    };
  });
  return mappedFeeds;
};

/**
 * return all coin feeds at once
 * @param games
 */
export const getPlayerMultipliers = async (
  players: string[],
  provider: any,
) => {
  const iface = new Interface(erc20Abi);
  // const ifaceChampions = new Interface(erc20Abi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];
  if (players.length === 0) {
    return [];
  }
  const DexKit = DEXKIT[ChainId.Matic] as Token;
  const Bittoken = BITTOKEN[ChainId.Matic] as Token;
  // const Champions = CHAMPIONS[ChainId.Matic] as Token;

  for (let index = 0; index < players.length; index++) {
    const addr = players[index];
    calls.push({
      interface: iface,
      target: DexKit?.address,
      function: 'balanceOf',
      args: [addr],
    });
  }
  for (let index = 0; index < players.length; index++) {
    const addr = players[index];
    calls.push({
      interface: iface,
      target: Bittoken?.address,
      function: 'balanceOf',
      args: [addr],
    });
  }
  // Use this when champions enable
  /*for (let index = 0; index < players.length; index++) {
    //@ts-ignore
    const id = players[index][3];
    calls.push({
      interface: iface,
      target: Champions?.address,
      function: 'rarity',
      args: [id],
    });
  }*/

  const response = await multicall.multiCall(calls);
  const [, results] = response;
  const kitBalances: BigNumber[] = [];
  const bittBalances: BigNumber[] = [];
  for (let index = 0; index < players.length; index++) {
    kitBalances.push(results[index]);
  }

  for (let index = 0; index < players.length; index++) {
    kitBalances.push(results[index]);
  }

  for (let index = players.length; index < players.length * 2; index++) {
    bittBalances.push(results[index]);
  }
  // TODO: check how the returned value is without object
  // We need to map manually to properties in order to work properly
  const mappedMultipliers = players.map((c: string, i) => {
    return {
      playerAddress: c as string,
      kitBalance: kitBalances[i],
      bittBalance: bittBalances[i],
      isHoldingMultiplier:
        kitBalances[i].gte(DEXKIT_MULTIPLIER_HOLDING) ||
        bittBalances[i].gte(BITTOKEN_MULTIPLIER_HOLDING),
      isHoldingKitMultiplier: kitBalances[i].gte(DEXKIT_MULTIPLIER_HOLDING),
      isHoldingBittMultiplier: bittBalances[i].gte(BITTOKEN_MULTIPLIER_HOLDING),
    };
  });

  return mappedMultipliers;
};

const GAS_PRICE_MULTIPLIER = 2;
export const joinGame = async (
  gameAddress: string,
  feeds: string[],
  amount: string,
  captainCoin: string,
  provider: any,
  affiliate: string, 
  championId: string,
) => {
  const pr = new providers.Web3Provider(provider);
  // const net =  await pr.getNetwork();

  const gasPrice = await (await pr?.getGasPrice())?.mul(GAS_PRICE_MULTIPLIER);

  return (
    await getCoinLeaguesContract(gameAddress, provider)
  ).joinGameWithCaptainCoin(feeds, captainCoin, affiliate, championId,  {
    value: amount,
    gasPrice,
  }) as Promise<ContractTransaction>;
};

export const startGame = async (gameAddress: string, provider: any) => {
  const pr = new providers.Web3Provider(provider);
  const gasPrice = await (await pr?.getGasPrice())?.mul(GAS_PRICE_MULTIPLIER);

  return (await getCoinLeaguesContract(gameAddress, provider)).startGame({
    gasPrice,
  }) as Promise<ContractTransaction>;
};

export const claim = async (
  gameAddress: string,
  provider: any,
  winner: string,
) => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);

  return (await getCoinLeaguesContract(gameAddress, provider)).claim(winner, {
    gasPrice,
  }) as Promise<ContractTransaction>;
};

export const withdrawGame = async (gameAddress: string, provider: any, account: string,) => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);
  return (await getCoinLeaguesContract(gameAddress, provider)).withdraw(account,{
    gasPrice,
  }) as Promise<ContractTransaction>;
};

export const getWinner = async (
  gameAddress: string,
  account: string,
  provider: any,
) => {
  return (await getCoinLeaguesContract(gameAddress, provider)).winners(account);
};

export const getAmountOnContract = async (
  gameAddress: string,
  account: string,
  provider: any,
) => {
  return (await getCoinLeaguesContract(gameAddress, provider)).amounts(account) as BigNumber;
};

