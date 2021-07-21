/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetAllTradeHistoryList
// ====================================================

export interface GetAllTradeHistoryList_ethereum_dexTrades_block_timestamp {
  __typename: "DateTime";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetAllTradeHistoryList_ethereum_dexTrades_block {
  __typename: "BlockExtended";
  /**
   * Block timestamp
   */
  timestamp: GetAllTradeHistoryList_ethereum_dexTrades_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetAllTradeHistoryList_ethereum_dexTrades_transaction_txFrom {
  __typename: "EthereumAddressInfo";
  /**
   * String address representation
   */
  address: string;
}

export interface GetAllTradeHistoryList_ethereum_dexTrades_transaction {
  __typename: "EthereumTransactionInfoExtended";
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
   * Transaction from address
   */
  txFrom: GetAllTradeHistoryList_ethereum_dexTrades_transaction_txFrom;
}

export interface GetAllTradeHistoryList_ethereum_dexTrades_exchange {
  __typename: "EthereumDex";
  /**
   * Full name ( name for known, Protocol for unknown )
   */
  fullName: string;
}

export interface GetAllTradeHistoryList_ethereum_dexTrades_smartContract_address {
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

export interface GetAllTradeHistoryList_ethereum_dexTrades_smartContract {
  __typename: "EthereumSmartContract";
  /**
   * Smart Contract Address
   */
  address: GetAllTradeHistoryList_ethereum_dexTrades_smartContract_address;
}

export interface GetAllTradeHistoryList_ethereum_dexTrades_sellCurrency {
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

export interface GetAllTradeHistoryList_ethereum_dexTrades_buyCurrency {
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

export interface GetAllTradeHistoryList_ethereum_dexTrades {
  __typename: "EthereumDexTrades";
  /**
   * Block in the blockchain
   */
  block: GetAllTradeHistoryList_ethereum_dexTrades_block | null;
  /**
   * Protocol name of the smart contract
   */
  protocol: string | null;
  /**
   * Transaction of DexTrade
   */
  transaction: GetAllTradeHistoryList_ethereum_dexTrades_transaction | null;
  /**
   * Identification of admin / manager / factory of smart contract, executing trades
   */
  exchange: GetAllTradeHistoryList_ethereum_dexTrades_exchange | null;
  /**
   * Smart contract being called
   */
  smartContract: GetAllTradeHistoryList_ethereum_dexTrades_smartContract | null;
  sellAmount: number | null;
  /**
   * Maker sells this currency
   */
  sellCurrency: GetAllTradeHistoryList_ethereum_dexTrades_sellCurrency | null;
  buyAmount: number | null;
  /**
   * Maker buys this currency
   */
  buyCurrency: GetAllTradeHistoryList_ethereum_dexTrades_buyCurrency | null;
  tradeAmount: number | null;
  tradeAmountInUsd: number | null;
}

export interface GetAllTradeHistoryList_ethereum_total {
  __typename: "EthereumDexTrades";
  count: number | null;
}

export interface GetAllTradeHistoryList_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetAllTradeHistoryList_ethereum_dexTrades[] | null;
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  total: GetAllTradeHistoryList_ethereum_total[] | null;
}

export interface GetAllTradeHistoryList {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetAllTradeHistoryList_ethereum | null;
}

export interface GetAllTradeHistoryListVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  address: string;
  limit: number;
  offset: number;
  from?: any | null;
  till?: any | null;
}
