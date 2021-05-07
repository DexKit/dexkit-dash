/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork, TradeSide } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetOrdersByHash
// ====================================================

export interface GetOrdersByHash_ethereum_dexTrades_timeInterval {
  __typename: "TimeInterval";
  second: string;
}

export interface GetOrdersByHash_ethereum_dexTrades_date {
  __typename: "Date";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  date: string;
}

export interface GetOrdersByHash_ethereum_dexTrades_block_timestamp {
  __typename: "DateTime";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetOrdersByHash_ethereum_dexTrades_block {
  __typename: "BlockExtended";
  /**
   * Block timestamp
   */
  timestamp: GetOrdersByHash_ethereum_dexTrades_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetOrdersByHash_ethereum_dexTrades_exchange {
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

export interface GetOrdersByHash_ethereum_dexTrades_smartContract_address {
  __typename: "Address";
  /**
   * String address representation
   */
  address: string;
  /**
   * Annotations ( tags ), if exists
   */
  annotation: string | null;
}

export interface GetOrdersByHash_ethereum_dexTrades_smartContract {
  __typename: "EthereumSmartContract";
  /**
   * Smart Contract Address
   */
  address: GetOrdersByHash_ethereum_dexTrades_smartContract_address;
}

export interface GetOrdersByHash_ethereum_dexTrades_transaction {
  __typename: "EthereumTransactionInfoExtended";
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetOrdersByHash_ethereum_dexTrades_baseCurrency {
  __typename: "Currency";
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
}

export interface GetOrdersByHash_ethereum_dexTrades_quoteCurrency {
  __typename: "Currency";
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
}

export interface GetOrdersByHash_ethereum_dexTrades {
  __typename: "EthereumDexTrades";
  /**
   * Time interval
   */
  timeInterval: GetOrdersByHash_ethereum_dexTrades_timeInterval | null;
  /**
   * Calendar date
   */
  date: GetOrdersByHash_ethereum_dexTrades_date | null;
  /**
   * Block in the blockchain
   */
  block: GetOrdersByHash_ethereum_dexTrades_block | null;
  /**
   * Index of trade in transaction, used to separate trades in transaction
   */
  tradeIndex: string | null;
  /**
   * Protocol name of the smart contract
   */
  protocol: string | null;
  /**
   * Identification of admin / manager / factory of smart contract, executing trades
   */
  exchange: GetOrdersByHash_ethereum_dexTrades_exchange | null;
  /**
   * Smart contract being called
   */
  smartContract: GetOrdersByHash_ethereum_dexTrades_smartContract | null;
  /**
   * Transaction of DexTrade
   */
  transaction: GetOrdersByHash_ethereum_dexTrades_transaction | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetOrdersByHash_ethereum_dexTrades_baseCurrency | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  /**
   * Quote currency
   */
  quoteCurrency: GetOrdersByHash_ethereum_dexTrades_quoteCurrency | null;
  quotePrice: number | null;
  tradeAmount: number | null;
  tradeAmountIsUsd: number | null;
  /**
   * Side of trade ( SELL / BUY )
   */
  side: TradeSide | null;
}

export interface GetOrdersByHash_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetOrdersByHash_ethereum_dexTrades[] | null;
}

export interface GetOrdersByHash {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetOrdersByHash_ethereum | null;
}

export interface GetOrdersByHashVariables {
  network: EthereumNetwork;
  address: string;
}
