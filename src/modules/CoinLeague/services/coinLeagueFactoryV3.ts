import { CallInput } from '@indexed-finance/multicall';
import { BigNumber, ContractTransaction, ethers, providers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { getMulticallFromProvider } from 'services/multicall';
import { getEthers } from 'services/web3modal';
import { CoinFeed, Game, GameParamsV3 } from 'types/coinleague';
import coinLeagueFactoryAbi from '../constants/ABI/CoinLeagueFactoryV3.json';
import championRoomAbi from '../constants/ABI/championRoom.json';
import erc20Abi from 'shared/constants/ABI/erc20.json';
import balanceOfAbi from 'shared/constants/ABI/balanceOf.json';
import getRarityOfAbi from '../constants/ABI/getRarityOf.json';
import { BITTOKEN, DEXKIT } from 'shared/constants/tokens';
import { ChainId } from 'types/blockchain';
import { Token } from 'types/app';
import {
  DEXKIT_MULTIPLIER_HOLDING,
  BITTOKEN_MULTIPLIER_HOLDING,
  CHAMPIONS,
} from '../constants';
import { getChampionsMultiplier, isChampionsFromRarity } from '../utils/champions';
import { MultiplierInterface } from '../utils/types';

export const getCoinLeagueV3Contract = async (
  address: string,
  provider: any,
) => {
  const pr = new providers.Web3Provider(provider).getSigner();
  return new ethers.Contract(address, coinLeagueFactoryAbi, pr);
};

/**
 * return all games data at once
 * @param games
 */
export const getGamesData = async (
  ids: string[],
  address: string,
  provider: any,
): Promise<Game[]> => {
  try {
    const iface = new Interface(coinLeagueFactoryAbi);
    const multicall = await getMulticallFromProvider(provider);
    const calls: CallInput[] = [];
    const games: Game[] = [];
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      calls.push({ interface: iface, target: address, function: 'games', args: [id] });
      calls.push({ interface: iface, target: address, function: 'getPlayers', args: [id] });
    }
    const response = await multicall.multiCall(calls);
    const [, results] = response;
    for (let index = 0; index < results.length; index += 2) {
      const g = results[index];
      const players = results[index + 1];
      games.push({
        players: players,
        ...g,
      });
    }
    return games;
  } catch (e) {


    return []
  }
};

/**
 * return all coin feeds at once
 * @param games
 */
export const getCoinFeeds = async (
  feeds: string[],
  factoryAddress: string,
  id: string,
  provider: any,
): Promise<CoinFeed[]> => {
  const iface = new Interface(coinLeagueFactoryAbi);
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
        target: factoryAddress,
        function: 'coins',
        args: [id, addr],
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
  factoryAddress: string,
  id: string,
  provider: any,
): Promise<{ price: BigNumber; feed: string }[]> => {
  const iface = new Interface(coinLeagueFactoryAbi);
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
      target: factoryAddress,
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
  players: any[],
  provider: any,
  chainId: ChainId.Binance | ChainId.Matic
) => {
  const iface = new Interface(balanceOfAbi);
  const ifaceChampions = new Interface(getRarityOfAbi);
  const multicall = await getMulticallFromProvider(provider);

  if (players.length === 0) {
    return [];
  }
  const DexKit = DEXKIT[chainId] as Token;
  const Bittoken = BITTOKEN[chainId] as Token;
  const Champions = CHAMPIONS[chainId];
  let mappedMultipliers: MultiplierInterface[] = [];

  const playersBatch = 11;

  for (let ind = 0; ind < players.length / playersBatch; ind++) {
    const playersSplit = players.slice(ind * playersBatch, (ind + 1) * playersBatch >= players.length ? players.length : (ind + 1) * playersBatch);
    const calls: CallInput[] = [];
    try {
      for (let index = 0; index < playersSplit.length; index++) {
        const addr = playersSplit[index][1];
        calls.push({
          interface: iface,
          target: DexKit?.address,
          function: 'balanceOf',
          args: [addr],
        });
      }
      for (let index = 0; index < playersSplit.length; index++) {
        const addr = playersSplit[index][1];
        calls.push({
          interface: iface,
          target: Bittoken?.address,
          function: 'balanceOf',
          args: [addr],
        });
      }
      // Use this when champions enable
      for (let index = 0; index < playersSplit.length; index++) {
        //@ts-ignore
        const id = playersSplit[index][3];
        calls.push({
          interface: ifaceChampions,
          target: Champions,
          function: 'getRarityOf',
          args: [id],
        });
      }

      const response = await multicall.multiCall(calls);

      const [, results] = response;
      const kitBalances: BigNumber[] = [];
      const bittBalances: BigNumber[] = [];
      const rarity: BigNumber[] = [];
      for (let index = 0; index < playersSplit.length; index++) {
        kitBalances.push(results[index]);
      }

      for (let index = playersSplit.length; index < playersSplit.length * 2; index++) {
        bittBalances.push(results[index]);
      }

      for (let index = playersSplit.length * 2; index < playersSplit.length * 3; index++) {
        rarity.push(results[index]);
      }
      // TODO: check how the returned value is without object
      // We need to map manually to properties in order to work properly
      mappedMultipliers = mappedMultipliers.concat(playersSplit.map((p: any, i) => {
        return {
          playerAddress: p[1] as string,
          kitBalance: kitBalances[i],
          bittBalance: bittBalances[i],
          isHoldingMultiplier:
            kitBalances[i].gte(DEXKIT_MULTIPLIER_HOLDING) ||
            bittBalances[i].gte(BITTOKEN_MULTIPLIER_HOLDING),
          isHoldingKitMultiplier: kitBalances[i].gte(DEXKIT_MULTIPLIER_HOLDING),
          isHoldingBittMultiplier: bittBalances[i].gte(BITTOKEN_MULTIPLIER_HOLDING),
          championsMultiplier: getChampionsMultiplier(rarity[i]),
          rarity: rarity[i],
          championId: p[3] as BigNumber,
          isChampionsMultiplier: isChampionsFromRarity(rarity[i])
        } as MultiplierInterface;
      }));
    } catch (e) {
      console.log(e);
    }
  }



  return mappedMultipliers;
};

export const getTokenMultipliers = async (
  account: string,
  provider: any,
) => {
  const iface = new Interface(erc20Abi);

  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];

  const DexKit = DEXKIT[ChainId.Matic] as Token;
  const Bittoken = BITTOKEN[ChainId.Matic] as Token;

  calls.push({
    interface: iface,
    target: DexKit?.address,
    function: 'balanceOf',
    args: [account],
  });


  calls.push({
    interface: iface,
    target: Bittoken?.address,
    function: 'balanceOf',
    args: [account],
  });



  const response = await multicall.multiCall(calls);

  const [, results] = response;
  let kitBalances: BigNumber;
  let bittBalances: BigNumber;


  kitBalances = results[0];
  bittBalances = results[1];

  // TODO: check how the returned value is without object
  // We need to map manually to properties in order to work properly
  return {
    kitBalance: kitBalances,
    bittBalance: bittBalances,
    isHoldingMultiplier:
      kitBalances.gte(DEXKIT_MULTIPLIER_HOLDING) ||
      bittBalances.gte(BITTOKEN_MULTIPLIER_HOLDING),
    isHoldingKitMultiplier: kitBalances.gte(DEXKIT_MULTIPLIER_HOLDING),
    isHoldingBittMultiplier: bittBalances.gte(BITTOKEN_MULTIPLIER_HOLDING),
  };

};

/**
 * return all games data at once
 * @param games
 */
export const getChampionRoom = async (
  gameAddress: string,
  provider: any,
): Promise<BigNumber> => {
  const iface = new Interface(championRoomAbi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];

  calls.push({ interface: iface, target: gameAddress, function: 'championRoom' });
  const response = await multicall.multiCall(calls);
  const [, results] = response;
  return results[0] as BigNumber

};



const GAS_PRICE_MULTIPLIER = 2;
export const joinGame = async (
  factoryAddress: string,
  feeds: string[],
  amount: string,
  captainCoin: string,
  provider: any,
  affiliate: string,
  id: string,
) => {
  const pr = new providers.Web3Provider(provider);
  // const net =  await pr.getNetwork();

  const gasPrice = await (await pr?.getGasPrice())?.mul(GAS_PRICE_MULTIPLIER);

  return (
    await getCoinLeagueV3Contract(factoryAddress, provider)
  ).joinGameWithCaptainCoin(feeds, captainCoin, affiliate, id, {
    gasPrice,
  }) as Promise<ContractTransaction>;
};

export const startGame = async (factoryAddress: string, provider: any, id: string) => {
  const pr = new providers.Web3Provider(provider);
  const gasPrice = await (await pr?.getGasPrice())?.mul(GAS_PRICE_MULTIPLIER);

  return (await getCoinLeagueV3Contract(factoryAddress, provider)).startGame(id, {
    gasPrice,
  }) as Promise<ContractTransaction>;
};

export const endGame = async (factoryAddress: string, provider: any, id: string) => {
  const pr = new providers.Web3Provider(provider);
  const gasPrice = await (await pr?.getGasPrice())?.mul(GAS_PRICE_MULTIPLIER);
  return (await getCoinLeagueV3Contract(factoryAddress, provider)).endGame(id, {
    gasPrice,
  }) as Promise<ContractTransaction>;
};

export const claim = async (
  gameAddress: string,
  provider: any,
  winner: string,
  id: string,
) => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);

  return (await getCoinLeagueV3Contract(gameAddress, provider)).claim(winner, id, {
    gasPrice,
  }) as Promise<ContractTransaction>;
};

export const abortGame = async (factoryAddress: string, provider: any, id: string) => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);

  return (await getCoinLeagueV3Contract(factoryAddress, provider)).abortGame(id, {
    gasPrice,
  }) as Promise<ContractTransaction>;
};

export const withdrawGame = async (gameAddress: string, provider: any, account: string, id: string) => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);

  return (await getCoinLeagueV3Contract(gameAddress, provider)).withdraw(account, id, {
    gasPrice,
  }) as Promise<ContractTransaction>;
};

export const getWinner = async (
  gameAddress: string,
  account: string,
  provider: any,
  id: string,
) => {
  return (await getCoinLeagueV3Contract(gameAddress, provider)).winners(id, account);
};

export const getAmountOnContract = async (
  gameAddress: string,
  account: string,
  provider: any,
  id: string
) => {
  return (await getCoinLeagueV3Contract(gameAddress, provider)).amounts(id, account) as BigNumber;
};


export const createGame = async (
  address: string,
  params: GameParamsV3,
  provider: any,
): Promise<ContractTransaction> => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);

  return (await getCoinLeagueV3Contract(address, provider)).createGame(
    params.numPlayers,
    params.duration,
    params.amountUnit,
    params.numCoins,
    params.abortTimestamp,
    params.startTimestamp,
    params.type,
    params.coin_to_play,
    { gasPrice },
  ) as Promise<ContractTransaction>;

};