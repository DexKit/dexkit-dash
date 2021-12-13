/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {EthereumNetwork} from './../../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: GetTokenPairs
// ====================================================

export interface GetTokenPairs_ethereum_dexTrades_baseCurrency {
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

export interface GetTokenPairs_ethereum_dexTrades_quoteCurrency {
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

export interface GetTokenPairs_ethereum_dexTrades_exchange {
  __typename: 'EthereumDex';
  /**
   * Full name ( name for known, Protocol for unknown )
   */
  fullName: string;
}

export interface GetTokenPairs_ethereum_dexTrades_smartContract_address {
  __typename: 'Address';
  /**
   * String address representation
   */
  address: string;
}

export interface GetTokenPairs_ethereum_dexTrades_smartContract {
  __typename: 'EthereumSmartContract';
  /**
   * Smart Contract Address
   */
  address: GetTokenPairs_ethereum_dexTrades_smartContract_address;
}

export interface GetTokenPairs_ethereum_dexTrades {
  __typename: 'EthereumDexTrades';
  trades: number | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetTokenPairs_ethereum_dexTrades_baseCurrency | null;
  quotePrice: number | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  /**
   * Quote currency
   */
  quoteCurrency: GetTokenPairs_ethereum_dexTrades_quoteCurrency | null;
  /**
   * Identification of admin / manager / factory of smart contract, executing trades
   */
  exchange: GetTokenPairs_ethereum_dexTrades_exchange | null;
  /**
   * Protocol name of the smart contract
   */
  protocol: string | null;
  tradeAmount: number | null;
  tradeAmountInUsd: number | null;
  maximumPrice: number | null;
  minimumPrice: number | null;
  openPrice: string | null;
  closePrice: string | null;
  /**
   * Smart contract being called
   */
  smartContract: GetTokenPairs_ethereum_dexTrades_smartContract | null;
}

export interface GetTokenPairs_ethereum {
  __typename: 'Ethereum';
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetTokenPairs_ethereum_dexTrades[] | null;
}

export interface GetTokenPairs {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTokenPairs_ethereum | null;
}

export interface GetTokenPairsVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  baseAddress: string;
  from?: any | null;
  limit: number;
}
