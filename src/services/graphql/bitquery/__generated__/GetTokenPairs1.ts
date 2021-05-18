/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetTokenPairs1
// ====================================================

export interface GetTokenPairs1_ethereum_data24_baseCurrency {
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

export interface GetTokenPairs1_ethereum_data24_quoteCurrency {
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

export interface GetTokenPairs1_ethereum_data24_exchange {
  __typename: "EthereumDex";
  /**
   * Name for known exchanges
   */
  name: string | null;
}

export interface GetTokenPairs1_ethereum_data24_smartContract_address {
  __typename: "Address";
  /**
   * String address representation
   */
  address: string;
}

export interface GetTokenPairs1_ethereum_data24_smartContract {
  __typename: "EthereumSmartContract";
  /**
   * Smart Contract Address
   */
  address: GetTokenPairs1_ethereum_data24_smartContract_address;
}

export interface GetTokenPairs1_ethereum_data24 {
  __typename: "EthereumDexTrades";
  trades: number | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  /**
   * Base currency
   */
  baseCurrency: GetTokenPairs1_ethereum_data24_baseCurrency | null;
  quotePrice: number | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  /**
   * Quote currency
   */
  quoteCurrency: GetTokenPairs1_ethereum_data24_quoteCurrency | null;
  /**
   * Protocol name of the smart contract
   */
  protocol: string | null;
  /**
   * Identification of admin / manager / factory of smart contract, executing trades
   */
  exchange: GetTokenPairs1_ethereum_data24_exchange | null;
  tradeAmount: number | null;
  tradeAmountInUsd: number | null;
  maximum_price: number | null;
  minimum_price: number | null;
  open_price: string | null;
  close_price: string | null;
  /**
   * Smart contract being called
   */
  smartContract: GetTokenPairs1_ethereum_data24_smartContract | null;
}

export interface GetTokenPairs1_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  data24: GetTokenPairs1_ethereum_data24[] | null;
}

export interface GetTokenPairs1 {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTokenPairs1_ethereum | null;
}

export interface GetTokenPairs1Variables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  baseAddress: string;
  from?: any | null;
}
