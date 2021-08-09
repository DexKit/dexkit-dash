/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {
  EthereumNetwork,
  TradeSide,
} from './../../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: GetTokenAnalytics
// ====================================================

export interface GetTokenAnalytics_ethereum_dexTrades_baseCurrency {
  __typename: 'Currency';
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Token Smart Contract Address
   */
  address: string | null;
}

export interface GetTokenAnalytics_ethereum_dexTrades {
  __typename: 'EthereumDexTrades';
  amountUSD: number | null;
  baseAmount: number | null;
  /**
   * Side of trade ( SELL / BUY )
   */
  side: TradeSide | null;
  /**
   * Base currency
   */
  baseCurrency: GetTokenAnalytics_ethereum_dexTrades_baseCurrency | null;
  count: number | null;
  gasValueUSD: number | null;
}

export interface GetTokenAnalytics_ethereum {
  __typename: 'Ethereum';
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetTokenAnalytics_ethereum_dexTrades[] | null;
}

export interface GetTokenAnalytics {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTokenAnalytics_ethereum | null;
}

export interface GetTokenAnalyticsVariables {
  network: EthereumNetwork;
  address: string;
  baseCurrency: string;
  from?: any | null;
  till?: any | null;
}
