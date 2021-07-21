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
  BTC = 44,
}

export enum Web3State {
  Done = 'Done',
  Error = 'Error',
  NotConnected = 'NotConnected',
  Connect = 'Connect',
  Connecting = 'Connecting',
  Locked = 'Locked',
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
