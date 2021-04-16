import { BigNumber } from '@0x/utils';

export enum OrderSide {
  Sell,
  Buy,
  Offer
}

export interface Order0x {
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

export interface SignedOrder extends Order0x {
  signature: string;
}



export interface Token {
  name: string;
  symbol: string;
  address: string;
  decimals: number;

  type?: string;
  annotation?: string;
  balance?: number;

  coingecko_id?: string; // coingecko id
  icon?: string;
  displayDecimals?: number;
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

export interface TokenStatistic {
  token: {
    symbol: string,
    address: string
  },
  transferCount: number,
  uniqSenders: number,
  uniqReceiver: number,
  totalAmount: number,
  medianTransferAmount: number,
  averageTransferAmount: number,
  firstTransferDate: string,
  lastTransferDate: string,
  daysTokenTransfered: number,
}






// TABLES
export interface OrderData {
  hash: string,
  block: number,
  side: string,
  exchange: string,
  contract: string,
  protocol: string,
  baseAmount: number,
  baseAmountUsd: number,
  baseToken: Token,
  quoteAmount: number,
  quoteAmountUsd: number,
  quoteToken: Token,
  quotePrice: number,
  tradeAmount: number,
  tradeAmountUsd: number,
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


export interface PairInfoExplorer {
  baseToken: Token,
  quoteToken: Token,
  address: string
  price: number,
  priceUsd: number,
  priceChange: number,
  liquidity: number,
  volume24: number,
  basePooled: number,
  quotePooled: number,  
}


export interface TransferByAddress {
  sender: string,
  receiver: string,
  token: Token,
  amount: number,
  hash: string,
  time: string
}