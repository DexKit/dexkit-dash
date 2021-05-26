/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetMyTokenBalanceWithoutHistory
// ====================================================

export interface GetMyTokenBalanceWithoutHistory_ethereum_address_balances_currency {
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
   * Decimals
   */
  decimals: number;
  /**
   * Token Smart Contract Address
   */
  address: string | null;
}

export interface GetMyTokenBalanceWithoutHistory_ethereum_address_balances {
  __typename: "EthereumBalance";
  /**
   * Currency of transfer
   */
  currency: GetMyTokenBalanceWithoutHistory_ethereum_address_balances_currency | null;
  value: number | null;
}

export interface GetMyTokenBalanceWithoutHistory_ethereum_address {
  __typename: "EthereumAddressInfoWithBalance";
  /**
   * DEPRECATED Balances by currencies for the address
   */
  balances: GetMyTokenBalanceWithoutHistory_ethereum_address_balances[] | null;
}

export interface GetMyTokenBalanceWithoutHistory_ethereum {
  __typename: "Ethereum";
  /**
   * Basic information about address ( or smart contract )
   */
  address: GetMyTokenBalanceWithoutHistory_ethereum_address[];
}

export interface GetMyTokenBalanceWithoutHistory {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetMyTokenBalanceWithoutHistory_ethereum | null;
}

export interface GetMyTokenBalanceWithoutHistoryVariables {
  network: EthereumNetwork;
  address: string;
}
