import {CallInput} from '@indexed-finance/multicall';
import {ContractTransaction, ethers, providers} from 'ethers';
import {Interface} from 'ethers/lib/utils';
import {GameParams} from 'types/coinsleague';
import coinLeaguesFactoryAbi from '../constants/ABI/coinLeaguesFactory.json';
import {getMulticallFromProvider} from '../../../services/multicall';
import {getEthers, getProvider} from '../../../services/web3modal';
import {ChainId} from 'types/blockchain';
// 0xA9f159D887745264aFe3C0Ba43BEad4255Af34E9
// 0x1539ffBa6D1c63255dD9F61627c8B4a855E82F2a
export const COIN_LEAGUES_FACTORY_ADDRESS = {
  [ChainId.Mumbai]: '0xb95051B17C42DE313F40623dB67D4E8087d7AdFA',
  [ChainId.Matic]: '0x8fFA73bB9404c6fa01A16e0F996787bD3F4CeF66',
};

export const getCoinLeaguesFactoryContract = async (address: string) => {
  const appProvider = getProvider();

  const provider = new providers.Web3Provider(appProvider).getSigner();

  return  new ethers.Contract(
    address,
    coinLeaguesFactoryAbi,
    provider,
  );
};
const GAS_PRICE_MULTIPLIER = 2;
export const createGame = async (address: string, params: GameParams) => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);
  return (await getCoinLeaguesFactoryContract(address)).createGame(
    params.numPlayers,
    params.duration,
    params.amountUnit,
    params.numCoins,
    params.abortTimestamp,
    params.type,
    {gasPrice},
  ) as Promise<ContractTransaction>;
};

export const getGamesAddressFromFactory = async (
  factoryAddress: string,
  maxGames: number,
  provider: any,
): Promise<[string[], number]> => {
  const iface = new Interface(coinLeaguesFactoryAbi);
  const multicall = await getMulticallFromProvider(provider);
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

  for (let index = start; index < total; index++) {
    calls.push({
      interface: iface,
      target: factoryAddress,
      function: 'allGames',
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

export const getCreatedGamesAddressFromFactory = async (
  factoryAddress: string,
  maxGames: number,
  provider: any,
): Promise<[string[], number]> => {
  const iface = new Interface(coinLeaguesFactoryAbi);
  const multicall = await getMulticallFromProvider(provider);
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: factoryAddress,
    function: 'totalCreatedGames',
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

  for (let index = start; index < total; index++) {
    calls.push({
      interface: iface,
      target: factoryAddress,
      function: 'createdGames',
      args: [index],
    });
  }
  if (calls.length) {
    const [, gamesAddress] = await multicall.multiCall(calls);
    return [gamesAddress as string[], totalGames[0] as number];
  } else {
    return [[], totalGames[0] as number];
  }
};

export const getStartedGamesAddressFromFactory = async (
  factoryAddress: string,
  maxGames: number,
  provider: any,
): Promise<[string[], number]> => {
  const iface = new Interface(coinLeaguesFactoryAbi);
  const multicall = await getMulticallFromProvider(provider);
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: factoryAddress,
    function: 'totalStartedGames',
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

  for (let index = start; index < total; index++) {
    calls.push({
      interface: iface,
      target: factoryAddress,
      function: 'startedGames',
      args: [index],
    });
  }
  if (calls.length) {
    const [, gamesAddress] = await multicall.multiCall(calls);
    return [gamesAddress as string[], totalGames[0].toNumber() as number];
  } else {
    return [[], totalGames[0].toNumber() as number];
  }
};

export const getEndedGamesAddressFromFactory = async (
  factoryAddress: string,
  maxGames: number,
  provider: any,
): Promise<[string[], number]> => {
  const iface = new Interface(coinLeaguesFactoryAbi);
  const multicall = await getMulticallFromProvider(provider);
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: factoryAddress,
    function: 'totalEndedGames',
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
  for (let index = start; index < total; index++) {
    calls.push({
      interface: iface,
      target: factoryAddress,
      function: 'endedGames',
      args: [index],
    });
  }
  if (calls.length) {
    const [, gamesAddress] = await multicall.multiCall(calls);
    return [gamesAddress as string[], totalGames[0].toNumber() as number];
  } else {
    return [[], totalGames[0].toNumber() as number];
  }
};

export const startGame = async (factoryAddress: string, id: string) => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);

  return (await getCoinLeaguesFactoryContract(factoryAddress)).startGame(id, {
    gasPrice,
  }) as Promise<ContractTransaction>;
};

export const endGame = async (factoryAddress: string, id: string) => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);

  return (await getCoinLeaguesFactoryContract(factoryAddress)).endGame(id, {
    gasPrice,
  }) as Promise<ContractTransaction>;
};

export const abortGame = async (factoryAddress: string, id: string) => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);
  return (await getCoinLeaguesFactoryContract(factoryAddress)).abortGame(id, {
    gasPrice,
  }) as Promise<ContractTransaction>;
};
