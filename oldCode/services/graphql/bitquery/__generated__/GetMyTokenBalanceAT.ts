/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetMyTokenBalanceAT
// ====================================================

export interface GetMyTokenBalanceAT_ethereum_address_balances_currency {
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
  /**
   * Token Type
   */
  tokenType: string | null;
}

export interface GetMyTokenBalanceAT_ethereum_address_balances {
  __typename: "EthereumBalance";
  /**
   * Currency of transfer
   */
  currency: GetMyTokenBalanceAT_ethereum_address_balances_currency | null;
  value: number | null;
}

export interface GetMyTokenBalanceAT_ethereum_address {
  __typename: "EthereumAddressInfoWithBalance";
  /**
   * DEPRECATED Balances by currencies for the address
   */
  balances: GetMyTokenBalanceAT_ethereum_address_balances[] | null;
}

export interface GetMyTokenBalanceAT_ethereum {
  __typename: "Ethereum";
  /**
   * Basic information about address ( or smart contract )
   */
  address: GetMyTokenBalanceAT_ethereum_address[];
}

export interface GetMyTokenBalanceAT {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetMyTokenBalanceAT_ethereum | null;
}

export interface GetMyTokenBalanceATVariables {
  network: EthereumNetwork;
  address: string;
  till: any;
}
