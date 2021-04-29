/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: BitquerySearch
// ====================================================

export interface BitquerySearch_ethereum_dexTrades_baseCurrency {
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
   * Currency symbol
   */
  symbol: string;
  /**
   * Currency name
   */
  name: string | null;
}

export interface BitquerySearch_ethereum_dexTrades_quoteCurrency {
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
   * Currency symbol
   */
  symbol: string;
  /**
   * Currency name
   */
  name: string | null;
}

export interface BitquerySearch_ethereum_dexTrades_smartContract_address {
  __typename: "Address";
  /**
   * String address representation
   */
  address: string;
}

export interface BitquerySearch_ethereum_dexTrades_smartContract {
  __typename: "EthereumSmartContract";
  /**
   * Smart Contract Address
   */
  address: BitquerySearch_ethereum_dexTrades_smartContract_address;
}

export interface BitquerySearch_ethereum_dexTrades {
  __typename: "EthereumDexTrades";
  /**
   * Base currency
   */
  baseCurrency: BitquerySearch_ethereum_dexTrades_baseCurrency | null;
  /**
   * Quote currency
   */
  quoteCurrency: BitquerySearch_ethereum_dexTrades_quoteCurrency | null;
  /**
   * Smart contract being called
   */
  smartContract: BitquerySearch_ethereum_dexTrades_smartContract | null;
}

export interface BitquerySearch_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: BitquerySearch_ethereum_dexTrades[] | null;
}

export interface BitquerySearch {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: BitquerySearch_ethereum | null;
}

export interface BitquerySearchVariables {
  network: EthereumNetwork;
  exchangeName: string;
  addresses?: string[] | null;
}
