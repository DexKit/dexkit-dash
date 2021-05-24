import { BigNumber } from '@0x/utils';
import { TokenBalance } from 'types/app';

export enum ChainId {
    Mainnet = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Kovan = 42,
    Goerli = 5,
    Ganache = 1337,
    Binance = 56,
    BinanceTest = 97
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