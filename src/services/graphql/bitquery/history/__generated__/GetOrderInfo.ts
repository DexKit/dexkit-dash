/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork, TradeSide } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetOrderInfo
// ====================================================

export interface GetOrderInfo_ethereum_dexTrades_baseCurrency {
  __typename: "Currency";
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Decimals
   */
  decimals: number;
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Token ID
   */
  tokenId: string | null;
}

export interface GetOrderInfo_ethereum_dexTrades_block_timestamp {
  __typename: "DateTime";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
  /**
   * Unix timestamp
   */
  unixtime: number;
}

export interface GetOrderInfo_ethereum_dexTrades_block {
  __typename: "BlockExtended";
  /**
   * Hash hex representation
   */
  hash: string;
  /**
   * Block number (height) in blockchain
   */
  height: number;
  /**
   * Block timestamp
   */
  timestamp: GetOrderInfo_ethereum_dexTrades_block_timestamp | null;
}

export interface GetOrderInfo_ethereum_dexTrades_date {
  __typename: "Date";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  date: string;
}

export interface GetOrderInfo_ethereum_dexTrades_exchange {
  __typename: "EthereumDex";
  /**
   * Full name ( name for known, Protocol for unknown )
   */
  fullName: string;
  /**
   * Name for known exchanges
   */
  name: string | null;
}

export interface GetOrderInfo_ethereum_dexTrades_maker {
  __typename: "EthereumAddressInfo";
  /**
   * String address representation
   */
  address: string;
}

export interface GetOrderInfo_ethereum_dexTrades_quoteCurrency {
  __typename: "Currency";
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Decimals
   */
  decimals: number;
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Token ID
   */
  tokenId: string | null;
}

export interface GetOrderInfo_ethereum_dexTrades_taker {
  __typename: "EthereumAddressInfo";
  /**
   * String address representation
   */
  address: string;
}

export interface GetOrderInfo_ethereum_dexTrades_transaction_to {
  __typename: "EthereumAddressInfo";
  /**
   * String address representation
   */
  address: string;
}

export interface GetOrderInfo_ethereum_dexTrades_transaction_txFrom {
  __typename: "EthereumAddressInfo";
  /**
   * String address representation
   */
  address: string;
}

export interface GetOrderInfo_ethereum_dexTrades_transaction {
  __typename: "EthereumTransactionInfoExtended";
  /**
   * Gas consumed
   */
  gas: number;
  /**
   * Gas price in Gwei
   */
  gasPrice: number;
  /**
   * Gas value cost
   */
  gasValue: number;
  /**
   * Hash hex representation
   */
  hash: string;
  /**
   * Transaction index in block, 0 based
   */
  index: number | null;
  /**
   * Transaction nonce
   */
  nonce: number | null;
  /**
   * Transaction receiver
   */
  to: GetOrderInfo_ethereum_dexTrades_transaction_to | null;
  /**
   * Transaction from address
   */
  txFrom: GetOrderInfo_ethereum_dexTrades_transaction_txFrom;
}

export interface GetOrderInfo_ethereum_dexTrades {
  __typename: "EthereumDexTrades";
  baseAmount: number | null;
  baseAmountInUSD: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetOrderInfo_ethereum_dexTrades_baseCurrency | null;
  /**
   * Block in the blockchain
   */
  block: GetOrderInfo_ethereum_dexTrades_block | null;
  count: number | null;
  /**
   * Calendar date
   */
  date: GetOrderInfo_ethereum_dexTrades_date | null;
  /**
   * Identification of admin / manager / factory of smart contract, executing trades
   */
  exchange: GetOrderInfo_ethereum_dexTrades_exchange | null;
  /**
   * Trade 'maker' side
   */
  maker: GetOrderInfo_ethereum_dexTrades_maker | null;
  /**
   * Protocol name of the smart contract
   */
  protocol: string | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  /**
   * Quote currency
   */
  quoteCurrency: GetOrderInfo_ethereum_dexTrades_quoteCurrency | null;
  quotePrice: number | null;
  /**
   * Side of trade ( SELL / BUY )
   */
  side: TradeSide | null;
  /**
   * Trade 'taker' side
   */
  taker: GetOrderInfo_ethereum_dexTrades_taker | null;
  tradeAmountInUsd: number | null;
  /**
   * Index of trade in transaction, used to separate trades in transaction
   */
  tradeIndex: string | null;
  /**
   * Transaction of DexTrade
   */
  transaction: GetOrderInfo_ethereum_dexTrades_transaction | null;
}

export interface GetOrderInfo_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetOrderInfo_ethereum_dexTrades[] | null;
}

export interface GetOrderInfo {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetOrderInfo_ethereum | null;
}

export interface GetOrderInfoVariables {
  network: EthereumNetwork;
  hash: string;
}
