import {GetAllMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetAllMyBalance';
import {EthereumNetwork} from 'shared/constants/AppEnums';

export type MyBalances = GetAllMyBalance_ethereum_address_balances & {
  network: EthereumNetwork;
};

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Kovan = 42,
  Goerli = 5,
  Ganache = 1337,
  Binance = 56,
  BinanceTest = 97,
  Matic = 137,
}

export enum Web3State {
  Done = 'Done',
  Error = 'Error',
  NotConnected = 'NotConnected',
  Connect = 'Connect',
  Connecting = 'Connecting',
  Locked = 'Locked',
}
/**
 * To distinguish between BTC, DOGE and ETH like networks: Matic, BSC, Avalanche
 */
export enum WalletType {
  evm = 'evm',
}

export enum SupportedNetworkType{
  bitcoin = 'bitcoin',
  evm = 'evm',
  dogecoin = 'dogecoin',
  cardano = 'cardano',
  dash = 'dash',
  eos = 'eos',
}

export enum Network {
  algorand = 'algorand',
  algorand_betanet = 'algorand_betanet',
  algorand_testnet = 'algorand_testnet',
  binance = 'binance',
  bitcash = 'bitcash',
  bitcoin = 'bitcoin',
  bitcoinsv = 'bitcoinsv',
  bsc = 'bsc',
  bsc_testnet = 'bsc_testnet',
  cardano = 'cardano',
  celo_alfajores = 'celo_alfajores',
  celo_baklava = 'celo_baklava',
  celo_rc1 = 'celo_rc1',
  conflux_oceanus = 'conflux_oceanus',
  conflux_tethys = 'conflux_tethys',
  dash = 'dash',
  diem_testnet = 'diem_testnet',
  dogecoin = 'dogecoin',
  eos = 'eos',
  eth2 = 'eth2',
  ethclassic = 'ethclassic',
  ethclassic_reorg = 'ethclassic_reorg',
  ethereum = 'ethereum',
  filecoin = 'filecoin',
  goerli = 'goerli',
  hedera = 'hedera',
  libra_testnet = 'libra_testnet',
  litecoin = 'litecoin',
  medalla = 'medalla',
  tron = 'tron',
  zcash = 'zcash',
}

// export interface BlockchainState {
//     readonly ethAccount: string;
//     readonly blockNumber: number;
//     readonly chainId: number;
//     readonly web3State: Web3State;
//     readonly tokenBalances: TokenBalance[];
//     readonly ethBalance: BigNumber;
//     readonly wethTokenBalance: TokenBalance | null;
// }
