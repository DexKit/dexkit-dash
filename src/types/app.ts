import { BigNumber } from '@0x/utils';

export interface Order {
  chainId: number;
  exchangeAddress: string;
  makerAddress: string;
  takerAddress: string;
  feeRecipientAddress: string;
  senderAddress: string;
  makerAssetAmount: BigNumber;
  takerAssetAmount: BigNumber;
  makerFee: BigNumber;
  takerFee: BigNumber;
  expirationTimeSeconds: BigNumber;
  salt: BigNumber;
  makerAssetData: string;
  takerAssetData: string;
  makerFeeAssetData: string;
  takerFeeAssetData: string;
}

export interface SignedOrder extends Order {
  signature: string;
}

export enum OrderSide {
  Sell,
  Buy,
  Offer
}

export interface Token {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  coingecko_id?: string; // coingecko id
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
  approved: BigNumber;
  token: Token;
}







// TABLES
export interface OrderData {
  hash: string,
  block: number,
  side: string,
  exchange: string,
  contract: string,
  protocol: string,
  sellAmountUsd: number,
  sellToken: Token,
  buyAmountUsd: number,
  buyToken: Token,
  created: Date
}

export interface OrderByToken {
  token: Token,
  tradeCount: number,
  amountUsd: number,
  daysTraded: number,
  started: string,
}

export interface OrderByPairs {
  sellAmount: number,
  sellToken: Token,
  buyAmount: number,
  buyToken: Token,
  medianPrice: number,
  lastPrice: number,
  tradeCount: number,
  daysTraded: number,
  started: string
}