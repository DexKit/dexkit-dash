/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetTokenSingleExplorer
// ====================================================

export interface GetTokenSingleExplorer_ethereum_dexTrades_baseCurrency {
  __typename: "Currency";
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Decimals
   */
  decimals: number;
}

export interface GetTokenSingleExplorer_ethereum_dexTrades {
  __typename: "EthereumDexTrades";
  trades: number | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetTokenSingleExplorer_ethereum_dexTrades_baseCurrency | null;
}

export interface GetTokenSingleExplorer_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetTokenSingleExplorer_ethereum_dexTrades[] | null;
}

export interface GetTokenSingleExplorer {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTokenSingleExplorer_ethereum | null;
}

export interface GetTokenSingleExplorerVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  baseAddress: string;
  from?: any | null;
}
