/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetAMMPairExplorer
// ====================================================

export interface GetAMMPairExplorer_ethereum_data24_timeInterval {
  __typename: "TimeInterval";
  day: string;
}

export interface GetAMMPairExplorer_ethereum_data24_baseCurrency {
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

export interface GetAMMPairExplorer_ethereum_data24_quoteCurrency {
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

export interface GetAMMPairExplorer_ethereum_data24 {
  __typename: "EthereumDexTrades";
  /**
   * Time interval
   */
  timeInterval: GetAMMPairExplorer_ethereum_data24_timeInterval | null;
  trades: number | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetAMMPairExplorer_ethereum_data24_baseCurrency | null;
  quotePrice: number | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  /**
   * Quote currency
   */
  quoteCurrency: GetAMMPairExplorer_ethereum_data24_quoteCurrency | null;
  tradeAmount: number | null;
  tradeAmountInUsd: number | null;
  maximum_price: number | null;
  minimum_price: number | null;
  open_price: string | null;
  close_price: string | null;
}

export interface GetAMMPairExplorer_ethereum_pooled_balances_currency {
  __typename: "Currency";
  /**
   * Currency symbol
   */
  symbol: string;
}

export interface GetAMMPairExplorer_ethereum_pooled_balances {
  __typename: "EthereumBalance";
  /**
   * Currency of transfer
   */
  currency: GetAMMPairExplorer_ethereum_pooled_balances_currency | null;
  value: number | null;
}

export interface GetAMMPairExplorer_ethereum_pooled {
  __typename: "EthereumAddressInfoWithBalance";
  /**
   * DEPRECATED Balances by currencies for the address
   */
  balances: GetAMMPairExplorer_ethereum_pooled_balances[] | null;
}

export interface GetAMMPairExplorer_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  data24: GetAMMPairExplorer_ethereum_data24[] | null;
  /**
   * Basic information about address ( or smart contract )
   */
  pooled: GetAMMPairExplorer_ethereum_pooled[];
}

export interface GetAMMPairExplorer {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetAMMPairExplorer_ethereum | null;
}

export interface GetAMMPairExplorerVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  pairAddress: string;
  quoteAddress: string;
}
