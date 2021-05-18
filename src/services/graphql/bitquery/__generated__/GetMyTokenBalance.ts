/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetMyTokenBalance
// ====================================================

export interface GetMyTokenBalance_ethereum_address_balances_currency {
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

export interface GetMyTokenBalance_ethereum_address_balances_history {
  __typename: "EthereumBalanceChange";
  /**
   * Block timestamp
   */
  timestamp: any | null;
  /**
   * Transfer amount ( positive inbound, negative outbound)
   */
  transferAmount: number | null;
  value: number | null;
}

export interface GetMyTokenBalance_ethereum_address_balances {
  __typename: "EthereumBalance";
  /**
   * Currency of transfer
   */
  currency: GetMyTokenBalance_ethereum_address_balances_currency | null;
  /**
   * History of balance changes by currencies for the address
   */
  history: GetMyTokenBalance_ethereum_address_balances_history[] | null;
  value: number | null;
}

export interface GetMyTokenBalance_ethereum_address {
  __typename: "EthereumAddressInfoWithBalance";
  /**
   * DEPRECATED Balances by currencies for the address
   */
  balances: GetMyTokenBalance_ethereum_address_balances[] | null;
}

export interface GetMyTokenBalance_ethereum {
  __typename: "Ethereum";
  /**
   * Basic information about address ( or smart contract )
   */
  address: GetMyTokenBalance_ethereum_address[];
}

export interface GetMyTokenBalance {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetMyTokenBalance_ethereum | null;
}

export interface GetMyTokenBalanceVariables {
  network: EthereumNetwork;
  address: string;
}
