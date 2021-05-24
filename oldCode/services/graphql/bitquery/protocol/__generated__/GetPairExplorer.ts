/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetPairExplorer
// ====================================================

export interface GetPairExplorer_ethereum_data24_timeInterval {
  __typename: "TimeInterval";
  day: string;
}

export interface GetPairExplorer_ethereum_data24_baseCurrency {
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

export interface GetPairExplorer_ethereum_data24_quoteCurrency {
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

export interface GetPairExplorer_ethereum_data24 {
  __typename: "EthereumDexTrades";
  /**
   * Time interval
   */
  timeInterval: GetPairExplorer_ethereum_data24_timeInterval | null;
  trades: number | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetPairExplorer_ethereum_data24_baseCurrency | null;
  quotePrice: number | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  /**
   * Quote currency
   */
  quoteCurrency: GetPairExplorer_ethereum_data24_quoteCurrency | null;
  tradeAmount: number | null;
  tradeAmountInUsd: number | null;
  maximum_price: number | null;
  minimum_price: number | null;
  open_price: string | null;
  close_price: string | null;
}

export interface GetPairExplorer_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  data24: GetPairExplorer_ethereum_data24[] | null;
}

export interface GetPairExplorer {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetPairExplorer_ethereum | null;
}

export interface GetPairExplorerVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  baseAddress: string;
  quoteAddress: string;
}
