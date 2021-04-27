/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetOrdersByPairs
// ====================================================

export interface GetOrdersByPairs_ethereum_dexTrades_sellCurrency {
  __typename: "Currency";
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Token Smart Contract Address
   */
  address: string | null;
}

export interface GetOrdersByPairs_ethereum_dexTrades_buyCurrency {
  __typename: "Currency";
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Token Smart Contract Address
   */
  address: string | null;
}

export interface GetOrdersByPairs_ethereum_dexTrades {
  __typename: "EthereumDexTrades";
  /**
   * Maker sells this currency
   */
  sellCurrency: GetOrdersByPairs_ethereum_dexTrades_sellCurrency | null;
  sellAmount: number | null;
  /**
   * Maker buys this currency
   */
  buyCurrency: GetOrdersByPairs_ethereum_dexTrades_buyCurrency | null;
  buyAmount: number | null;
  count: number | null;
  median_price: number | null;
  last_price: string | null;
  dates: number | null;
  started: string | null;
}

export interface GetOrdersByPairs_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetOrdersByPairs_ethereum_dexTrades[] | null;
}

export interface GetOrdersByPairs {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetOrdersByPairs_ethereum | null;
}

export interface GetOrdersByPairsVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  limit: number;
  offset: number;
  from?: any | null;
  till?: any | null;
}
