/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {
  EthereumNetwork,
  TradeSide,
} from './../../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: GetContractOrders
// ====================================================

export interface GetContractOrders_ethereum_dexTrades_timeInterval {
  __typename: 'TimeInterval';
  second: string;
}

export interface GetContractOrders_ethereum_dexTrades_date {
  __typename: 'Date';
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  date: string;
}

export interface GetContractOrders_ethereum_dexTrades_block_timestamp {
  __typename: 'DateTime';
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetContractOrders_ethereum_dexTrades_block {
  __typename: 'BlockExtended';
  /**
   * Block timestamp
   */
  timestamp: GetContractOrders_ethereum_dexTrades_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetContractOrders_ethereum_dexTrades_exchange {
  __typename: 'EthereumDex';
  /**
   * Full name ( name for known, Protocol for unknown )
   */
  fullName: string;
  /**
   * Name for known exchanges
   */
  name: string | null;
}

export interface GetContractOrders_ethereum_dexTrades_smartContract_address {
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

export interface GetContractOrders_ethereum_dexTrades_smartContract {
  __typename: 'EthereumSmartContract';
  /**
   * Smart Contract Address
   */
  address: GetContractOrders_ethereum_dexTrades_smartContract_address;
}

export interface GetContractOrders_ethereum_dexTrades_transaction {
  __typename: 'EthereumTransactionInfoExtended';
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetContractOrders_ethereum_dexTrades_baseCurrency {
  __typename: 'Currency';
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Decimals
   */
  decimals: number;
}

export interface GetContractOrders_ethereum_dexTrades_quoteCurrency {
  __typename: 'Currency';
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Decimals
   */
  decimals: number;
}

export interface GetContractOrders_ethereum_dexTrades {
  __typename: 'EthereumDexTrades';
  /**
   * Time interval
   */
  timeInterval: GetContractOrders_ethereum_dexTrades_timeInterval | null;
  /**
   * Calendar date
   */
  date: GetContractOrders_ethereum_dexTrades_date | null;
  /**
   * Block in the blockchain
   */
  block: GetContractOrders_ethereum_dexTrades_block | null;
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
  exchange: GetContractOrders_ethereum_dexTrades_exchange | null;
  /**
   * Smart contract being called
   */
  smartContract: GetContractOrders_ethereum_dexTrades_smartContract | null;
  /**
   * Transaction of DexTrade
   */
  transaction: GetContractOrders_ethereum_dexTrades_transaction | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetContractOrders_ethereum_dexTrades_baseCurrency | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  /**
   * Quote currency
   */
  quoteCurrency: GetContractOrders_ethereum_dexTrades_quoteCurrency | null;
  quotePrice: number | null;
  tradeAmount: number | null;
  tradeAmountIsUsd: number | null;
  /**
   * Side of trade ( SELL / BUY )
   */
  side: TradeSide | null;
}

export interface GetContractOrders_ethereum {
  __typename: 'Ethereum';
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetContractOrders_ethereum_dexTrades[] | null;
}

export interface GetContractOrders {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetContractOrders_ethereum | null;
}

export interface GetContractOrdersVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  address: string;
  quoteAddress: string;
  limit: number;
  offset: number;
  from?: any | null;
  till?: any | null;
  tradeAmount?: number | null;
}
