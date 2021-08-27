/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetSingleBalance
// ====================================================

export interface GetSingleBalance_ethereum_address_balances_currency {
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

export interface GetSingleBalance_ethereum_address_balances {
  __typename: "EthereumBalance";
  /**
   * Currency of transfer
   */
  currency: GetSingleBalance_ethereum_address_balances_currency | null;
  value: number | null;
}

export interface GetSingleBalance_ethereum_address {
  __typename: "EthereumAddressInfoWithBalance";
  /**
   * DEPRECATED Balances by currencies for the address
   */
  balances: GetSingleBalance_ethereum_address_balances[] | null;
}

export interface GetSingleBalance_ethereum {
  __typename: "Ethereum";
  /**
   * Basic information about address ( or smart contract )
   */
  address: GetSingleBalance_ethereum_address[];
}

export interface GetSingleBalance {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetSingleBalance_ethereum | null;
}

export interface GetSingleBalanceVariables {
  network: EthereumNetwork;
  address: string;
  currency: string;
}
