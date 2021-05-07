/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetTotalTokenTrades
// ====================================================

export interface GetTotalTokenTrades_ethereum_dexTrades {
  __typename: "EthereumDexTrades";
  totalTrades: number | null;
}

export interface GetTotalTokenTrades_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetTotalTokenTrades_ethereum_dexTrades[] | null;
}

export interface GetTotalTokenTrades {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTotalTokenTrades_ethereum | null;
}

export interface GetTotalTokenTradesVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  baseAddress?: string | null;
  quoteAddress?: string | null;
  from?: any | null;
  till?: any | null;
}
