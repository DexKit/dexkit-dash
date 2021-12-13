/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {
  EthereumNetwork,
  TradeSide,
} from './../../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: GetTradeHistoryList
// ====================================================

export interface GetTradeHistoryList_ethereum_dexTrades_block_timestamp {
  __typename: 'DateTime';
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetTradeHistoryList_ethereum_dexTrades_block {
  __typename: 'BlockExtended';
  /**
   * Block timestamp
   */
  timestamp: GetTradeHistoryList_ethereum_dexTrades_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetTradeHistoryList_ethereum_dexTrades_transaction_txFrom {
  __typename: 'EthereumAddressInfo';
  /**
   * String address representation
   */
  address: string;
}

export interface GetTradeHistoryList_ethereum_dexTrades_transaction {
  __typename: 'EthereumTransactionInfoExtended';
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
  txFrom: GetTradeHistoryList_ethereum_dexTrades_transaction_txFrom;
}

export interface GetTradeHistoryList_ethereum_dexTrades_exchange {
  __typename: 'EthereumDex';
  /**
   * Full name ( name for known, Protocol for unknown )
   */
  fullName: string;
}

export interface GetTradeHistoryList_ethereum_dexTrades_smartContract_address {
  __typename: 'Address';
  /**
   * String address representation
   */
  address: string;
  /**
   * Annotations ( tags ), if exists
   */
  annotation: string | null;
}

export interface GetTradeHistoryList_ethereum_dexTrades_smartContract {
  __typename: 'EthereumSmartContract';
  /**
   * Smart Contract Address
   */
  address: GetTradeHistoryList_ethereum_dexTrades_smartContract_address;
}

export interface GetTradeHistoryList_ethereum_dexTrades_baseCurrency {
  __typename: 'Currency';
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

export interface GetTradeHistoryList_ethereum_dexTrades_quoteCurrency {
  __typename: 'Currency';
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

export interface GetTradeHistoryList_ethereum_dexTrades {
  __typename: 'EthereumDexTrades';
  /**
   * Block in the blockchain
   */
  block: GetTradeHistoryList_ethereum_dexTrades_block | null;
  /**
   * Protocol name of the smart contract
   */
  protocol: string | null;
  /**
   * Transaction of DexTrade
   */
  transaction: GetTradeHistoryList_ethereum_dexTrades_transaction | null;
  /**
   * Identification of admin / manager / factory of smart contract, executing trades
   */
  exchange: GetTradeHistoryList_ethereum_dexTrades_exchange | null;
  /**
   * Smart contract being called
   */
  smartContract: GetTradeHistoryList_ethereum_dexTrades_smartContract | null;
  /**
   * Side of trade ( SELL / BUY )
   */
  side: TradeSide | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetTradeHistoryList_ethereum_dexTrades_baseCurrency | null;
  quotePrice: number | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  /**
   * Quote currency
   */
  quoteCurrency: GetTradeHistoryList_ethereum_dexTrades_quoteCurrency | null;
  tradeAmount: number | null;
  tradeAmountIsUsd: number | null;
}

export interface GetTradeHistoryList_ethereum_total {
  __typename: 'EthereumDexTrades';
  count: number | null;
}

export interface GetTradeHistoryList_ethereum {
  __typename: 'Ethereum';
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetTradeHistoryList_ethereum_dexTrades[] | null;
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  total: GetTradeHistoryList_ethereum_total[] | null;
}

export interface GetTradeHistoryList {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTradeHistoryList_ethereum | null;
}

export interface GetTradeHistoryListVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  address: string;
  limit: number;
  offset: number;
  from?: any | null;
  till?: any | null;
  baseCurrency?: string | null;
}
