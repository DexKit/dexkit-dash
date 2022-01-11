import { CallInput } from '@indexed-finance/multicall';
import { ContractTransaction, ethers, providers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { GameParams } from 'types/coinsleague';
import coinLeaguesFactoryAbi from '../constants/ABI/coinLeaguesFactory.json';
import coinLeagueFactoryNFTAbi from '../constants/ABI/coinLeagueFactoryNFT.json';
import { getMulticallFromProvider } from '../../../services/multicall';
import { getEthers, getProvider } from '../../../services/web3modal';

// 0xA9f159D887745264aFe3C0Ba43BEad4255Af34E9
// 0x1539ffBa6D1c63255dD9F61627c8B4a855E82F2a

export const getCoinLeaguesFactoryContract = async (address: string, isNFT = false) => {
  const appProvider = getProvider();

  const provider = new providers.Web3Provider(appProvider).getSigner();

  return new ethers.Contract(address, isNFT ? coinLeagueFactoryNFTAbi : coinLeaguesFactoryAbi, provider);
};

export const getCoinLeaguesFactoryContractWithProvider = async (address: string, provider: any, isNFT = false) => {
  const pr = new providers.Web3Provider(provider).getSigner();
  return new ethers.Contract(address, isNFT ? coinLeagueFactoryNFTAbi : coinLeaguesFactoryAbi, pr);
};

export const getCoinLeaguesFactoryContractWithNetworkProvider = async (address: string, provider: any, isNFT = false) => {
  return new ethers.Contract(address, isNFT ? coinLeagueFactoryNFTAbi : coinLeaguesFactoryAbi, provider);
};



const GAS_PRICE_MULTIPLIER = 2;
export const createGame = async (
  address: string,
  params: GameParams,
  provider: any,
): Promise<ContractTransaction> => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);
  if (params.isNFT) {
    return (await getCoinLeaguesFactoryContractWithProvider(address, provider, params.isNFT)).createGame(
      params.numPlayers,
      params.duration,
      params.amountUnit,
      params.numCoins,
      params.abortTimestamp,
      params.startTimestamp,
      params.type,
      params.championRoom,
      { gasPrice },
    ) as Promise<ContractTransaction>;
  } else {
    return (await getCoinLeaguesFactoryContractWithProvider(address, provider, params.isNFT)).createGame(
      params.numPlayers,
      params.duration,
      params.amountUnit,
      params.numCoins,
      params.abortTimestamp,
      params.startTimestamp,
      params.type,
      { gasPrice },
    ) as Promise<ContractTransaction>;
  }
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

export const getTotalGamesFromFactory = async (
  factoryAddress: string,
  provider: any,
): Promise<number> => {
  const iface = new Interface(coinLeaguesFactoryAbi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];

  calls.push({
    interface: iface,
    target: factoryAddress,
    function: 'totalGames',
  });
  const [, totalGames] = await multicall.multiCall(calls);
  const total = totalGames[0] ? totalGames[0].toNumber() : 0;
  return total;
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

export const getGameAddressFromId = async (
  factoryAddress: string,
  id: string,
  provider: any,
): Promise<string> => {
  return (await getCoinLeaguesFactoryContractWithNetworkProvider(factoryAddress, provider)).allGames(
    id,
  ) as string;
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
