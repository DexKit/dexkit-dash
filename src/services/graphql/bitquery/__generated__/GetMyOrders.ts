/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork, TradeSide } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetMyOrders
// ====================================================

export interface GetMyOrders_ethereum_maker_block_timestamp {
  __typename: "DateTime";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetMyOrders_ethereum_maker_block {
  __typename: "BlockExtended";
  /**
   * Block timestamp
   */
  timestamp: GetMyOrders_ethereum_maker_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetMyOrders_ethereum_maker_transaction {
  __typename: "EthereumTransactionInfoExtended";
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetMyOrders_ethereum_maker_exchange {
  __typename: "EthereumDex";
  /**
   * Full name ( name for known, Protocol for unknown )
   */
  fullName: string;
}

export interface GetMyOrders_ethereum_maker_smartContract_address {
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

export interface GetMyOrders_ethereum_maker_smartContract {
  __typename: "EthereumSmartContract";
  /**
   * Smart Contract Address
   */
  address: GetMyOrders_ethereum_maker_smartContract_address;
}

export interface GetMyOrders_ethereum_maker_baseCurrency {
  __typename: "Currency";
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Decimals
   */
  decimals: number;
}

export interface GetMyOrders_ethereum_maker_quoteCurrency {
  __typename: "Currency";
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Decimals
   */
  decimals: number;
}

export interface GetMyOrders_ethereum_maker {
  __typename: "EthereumDexTrades";
  /**
   * Block in the blockchain
   */
  block: GetMyOrders_ethereum_maker_block | null;
  /**
   * Index of trade in transaction, used to separate trades in transaction
   */
  tradeIndex: string | null;
  /**
   * Protocol name of the smart contract
   */
  protocol: string | null;
  /**
   * Transaction of DexTrade
   */
  transaction: GetMyOrders_ethereum_maker_transaction | null;
  /**
   * Identification of admin / manager / factory of smart contract, executing trades
   */
  exchange: GetMyOrders_ethereum_maker_exchange | null;
  /**
   * Smart contract being called
   */
  smartContract: GetMyOrders_ethereum_maker_smartContract | null;
  /**
   * Side of trade ( SELL / BUY )
   */
  side: TradeSide | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetMyOrders_ethereum_maker_baseCurrency | null;
  quotePrice: number | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  /**
   * Quote currency
   */
  quoteCurrency: GetMyOrders_ethereum_maker_quoteCurrency | null;
  tradeAmount: number | null;
  tradeAmountIsUsd: number | null;
}

export interface GetMyOrders_ethereum_taker_block_timestamp {
  __typename: "DateTime";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetMyOrders_ethereum_taker_block {
  __typename: "BlockExtended";
  /**
   * Block timestamp
   */
  timestamp: GetMyOrders_ethereum_taker_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetMyOrders_ethereum_taker_date {
  __typename: "Date";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  date: string;
}

export interface GetMyOrders_ethereum_taker_transaction {
  __typename: "EthereumTransactionInfoExtended";
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetMyOrders_ethereum_taker_exchange {
  __typename: "EthereumDex";
  /**
   * Full name ( name for known, Protocol for unknown )
   */
  fullName: string;
}

export interface GetMyOrders_ethereum_taker_smartContract_address {
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

export interface GetMyOrders_ethereum_taker_smartContract {
  __typename: "EthereumSmartContract";
  /**
   * Smart Contract Address
   */
  address: GetMyOrders_ethereum_taker_smartContract_address;
}

export interface GetMyOrders_ethereum_taker_baseCurrency {
  __typename: "Currency";
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Decimals
   */
  decimals: number;
}

export interface GetMyOrders_ethereum_taker_quoteCurrency {
  __typename: "Currency";
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Decimals
   */
  decimals: number;
}

export interface GetMyOrders_ethereum_taker {
  __typename: "EthereumDexTrades";
  /**
   * Block in the blockchain
   */
  block: GetMyOrders_ethereum_taker_block | null;
  /**
   * Calendar date
   */
  date: GetMyOrders_ethereum_taker_date | null;
  /**
   * Index of trade in transaction, used to separate trades in transaction
   */
  tradeIndex: string | null;
  /**
   * Protocol name of the smart contract
   */
  protocol: string | null;
  /**
   * Transaction of DexTrade
   */
  transaction: GetMyOrders_ethereum_taker_transaction | null;
  /**
   * Identification of admin / manager / factory of smart contract, executing trades
   */
  exchange: GetMyOrders_ethereum_taker_exchange | null;
  /**
   * Smart contract being called
   */
  smartContract: GetMyOrders_ethereum_taker_smartContract | null;
  /**
   * Side of trade ( SELL / BUY )
   */
  side: TradeSide | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetMyOrders_ethereum_taker_baseCurrency | null;
  quotePrice: number | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  /**
   * Quote currency
   */
  quoteCurrency: GetMyOrders_ethereum_taker_quoteCurrency | null;
  tradeAmount: number | null;
  tradeAmountIsUsd: number | null;
}

export interface GetMyOrders_ethereum_makerCount {
  __typename: "EthereumDexTrades";
  count: number | null;
}

export interface GetMyOrders_ethereum_takerCount {
  __typename: "EthereumDexTrades";
  count: number | null;
}

export interface GetMyOrders_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  maker: GetMyOrders_ethereum_maker[] | null;
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  taker: GetMyOrders_ethereum_taker[] | null;
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  makerCount: GetMyOrders_ethereum_makerCount[] | null;
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  takerCount: GetMyOrders_ethereum_takerCount[] | null;
}

export interface GetMyOrders {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetMyOrders_ethereum | null;
}

export interface GetMyOrdersVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  address: string;
  limit: number;
  offset: number;
  from?: any | null;
  till?: any | null;
}
