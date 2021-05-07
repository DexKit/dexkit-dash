/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetOrdersByTokens
// ====================================================

export interface GetOrdersByTokens_ethereum_dexTrades_currency {
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

export interface GetOrdersByTokens_ethereum_dexTrades {
  __typename: "EthereumDexTrades";
  /**
   * Base currency
   */
  currency: GetOrdersByTokens_ethereum_dexTrades_currency | null;
  count: number | null;
  currencyAmount: number | null;
  tradeAmountInUsd: number | null;
  dates: number | null;
  started: string | null;
}

export interface GetOrdersByTokens_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetOrdersByTokens_ethereum_dexTrades[] | null;
}

export interface GetOrdersByTokens {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetOrdersByTokens_ethereum | null;
}

export interface GetOrdersByTokensVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  limit: number;
  offset: number;
  from?: any | null;
  till?: any | null;
}
