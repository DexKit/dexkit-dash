/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {EthereumNetwork} from './../../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: GetPairExplorer
// ====================================================

export interface GetPairExplorer_ethereum_dexTrades_baseCurrency {
  __typename: 'Currency';
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

export interface GetPairExplorer_ethereum_dexTrades_quoteCurrency {
  __typename: 'Currency';
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

export interface GetPairExplorer_ethereum_dexTrades {
  __typename: 'EthereumDexTrades';
  trades: number | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetPairExplorer_ethereum_dexTrades_baseCurrency | null;
  quotePrice: number | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  /**
   * Quote currency
   */
  quoteCurrency: GetPairExplorer_ethereum_dexTrades_quoteCurrency | null;
  tradeAmount: number | null;
  tradeAmountInUsd: number | null;
  maximum_price: number | null;
  minimum_price: number | null;
  open_price: string | null;
  close_price: string | null;
}

export interface GetPairExplorer_ethereum {
  __typename: 'Ethereum';
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetPairExplorer_ethereum_dexTrades[] | null;
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
  from?: any | null;
}
