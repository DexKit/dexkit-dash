import { BigNumber } from '@0x/utils';

export interface Token {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
    primaryColor?: string;
    id?: string;
    c_id?: string; // coingecko id
    icon?: string;
    displayDecimals: number;
    minAmount?: number;
    maxAmount?: number;
    precision?: number;
    website?: string;
    description?: string;
    price_usd?: BigNumber | null;
    price_usd_24h_change?: BigNumber | null;
    listed?: boolean;
    isStableCoin?: boolean;
    tags?: string[];
}

export interface TokenPrice {
    c_id: string; // coingecko id
    price_usd: BigNumber;
    price_usd_24h_change: BigNumber;
}

export interface TokenBalance {
    balance: BigNumber;
    isUnlocked: boolean;
    token: Token;
}

export enum Web3State {
    Done = 'Done',
    Error = 'Error',
    NotConnected = 'NotConnected',
    Connect = 'Connect',
    Connecting = 'Connecting',
    Locked = 'Locked',
}

export interface BlockchainState {
    readonly ethAccount: string;
    readonly blocknumber: number;
    readonly chainId: number;
    readonly web3State: Web3State;
    readonly tokenBalances: TokenBalance[];
    readonly ethBalance: BigNumber;
    readonly wethTokenBalance: TokenBalance | null;
}