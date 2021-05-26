import { BigNumber } from '@0x/utils';
import { GetOrderList_ethereum_maker_baseCurrency, GetOrderList_ethereum_maker_block, GetOrderList_ethereum_maker_exchange, GetOrderList_ethereum_maker_quoteCurrency, GetOrderList_ethereum_maker_smartContract, GetOrderList_ethereum_maker_transaction } from 'services/graphql/bitquery/history/__generated__/GetOrderList';
import { GetTransactionList_ethereum_sender_block, GetTransactionList_ethereum_sender_currency, GetTransactionList_ethereum_sender_receiver, GetTransactionList_ethereum_sender_sender, GetTransactionList_ethereum_sender_transaction } from 'services/graphql/bitquery/history/__generated__/GetTransactionList';
import { TradeSide } from '../../__generated__/globalTypes';

export enum OrderSide {
  Sell,
  Buy,
  Offer
}

export enum Steps {
  APPROVE,
  CONVERT,
  ORDER,
  ERROR,
  DONE
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
  displayDecimals?: 4,
	icon?: string;
  price_usd?: BigNumber;
	price_usd_24h_change?: BigNumber;
	coingecko_id?: string;
}

export interface TokenBalance {
  balance: BigNumber;
  approved: BigNumber;
  token: Token;
}

export interface GasInfo {
  gasPriceInWei: BigNumber;
  estimatedTimeMs: number;
}

export interface ITransactionList {
  block: GetTransactionList_ethereum_sender_block | null;
  sender: GetTransactionList_ethereum_sender_sender | null;
  receiver: GetTransactionList_ethereum_sender_receiver | null;
  currency: GetTransactionList_ethereum_sender_currency | null;
  amount: number | null;
  amountInUsd: number | null;
  transaction: GetTransactionList_ethereum_sender_transaction | null;
  external: boolean | null;
  type: string;
}



export interface IOrderList {
  block: GetOrderList_ethereum_maker_block | null;
  tradeIndex: string | null;
  protocol: string | null;
  transaction: GetOrderList_ethereum_maker_transaction | null;
  exchange: GetOrderList_ethereum_maker_exchange | null;
  smartContract: GetOrderList_ethereum_maker_smartContract | null;
  side: TradeSide | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  baseCurrency: GetOrderList_ethereum_maker_baseCurrency | null;
  quotePrice: number | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  quoteCurrency: GetOrderList_ethereum_maker_quoteCurrency | null;
  tradeAmount: number | null;
  tradeAmountIsUsd: number | null;
}