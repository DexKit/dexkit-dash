/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork, TradeSide } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetTokenTrades
// ====================================================

export interface GetTokenTrades_ethereum_dexTrades_block_timestamp {
  __typename: "DateTime";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetTokenTrades_ethereum_dexTrades_block {
  __typename: "BlockExtended";
  /**
   * Block timestamp
   */
  timestamp: GetTokenTrades_ethereum_dexTrades_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetTokenTrades_ethereum_dexTrades_exchange {
  __typename: "EthereumDex";
  /**
   * Full name ( name for known, Protocol for unknown )
   */
  fullName: string;
}

export interface GetTokenTrades_ethereum_dexTrades_smartContract_address {
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

export interface GetTokenTrades_ethereum_dexTrades_smartContract {
  __typename: "EthereumSmartContract";
  /**
   * Smart Contract Address
   */
  address: GetTokenTrades_ethereum_dexTrades_smartContract_address;
}

export interface GetTokenTrades_ethereum_dexTrades_transaction {
  __typename: "EthereumTransactionInfoExtended";
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetTokenTrades_ethereum_dexTrades_baseCurrency {
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
}

export interface GetTokenTrades_ethereum_dexTrades_quoteCurrency {
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
}

export interface GetTokenTrades_ethereum_dexTrades {
  __typename: "EthereumDexTrades";
  /**
   * Index of trade in transaction, used to separate trades in transaction
   */
  tradeIndex: string | null;
  /**
   * Block in the blockchain
   */
  block: GetTokenTrades_ethereum_dexTrades_block | null;
  /**
   * Protocol name of the smart contract
   */
  protocol: string | null;
  /**
   * Identification of admin / manager / factory of smart contract, executing trades
   */
  exchange: GetTokenTrades_ethereum_dexTrades_exchange | null;
  /**
   * Smart contract being called
   */
  smartContract: GetTokenTrades_ethereum_dexTrades_smartContract | null;
  /**
   * Transaction of DexTrade
   */
  transaction: GetTokenTrades_ethereum_dexTrades_transaction | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetTokenTrades_ethereum_dexTrades_baseCurrency | null;
  /**
   * Side of trade ( SELL / BUY )
   */
  side: TradeSide | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  /**
   * Quote currency
   */
  quoteCurrency: GetTokenTrades_ethereum_dexTrades_quoteCurrency | null;
  tradeAmount: number | null;
  tradeAmountIsUsd: number | null;
}

export interface GetTokenTrades_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetTokenTrades_ethereum_dexTrades[] | null;
}

export interface GetTokenTrades {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTokenTrades_ethereum | null;
}

export interface GetTokenTradesVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  baseAddress?: string | null;
  quoteAddress?: string | null;
  limit: number;
  offset: number;
}
