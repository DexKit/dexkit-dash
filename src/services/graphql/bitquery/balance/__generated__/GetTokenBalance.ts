/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetTokenBalance
// ====================================================

export interface GetTokenBalance_ethereum_address_balances_history {
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

export interface GetTokenBalance_ethereum_address_balances_currency {
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

export interface GetTokenBalance_ethereum_address_balances {
  __typename: "EthereumBalance";
  /**
   * History of balance changes by currencies for the address
   */
  history: GetTokenBalance_ethereum_address_balances_history[] | null;
  /**
   * Currency of transfer
   */
  currency: GetTokenBalance_ethereum_address_balances_currency | null;
}

export interface GetTokenBalance_ethereum_address {
  __typename: "EthereumAddressInfoWithBalance";
  /**
   * DEPRECATED Balances by currencies for the address
   */
  balances: GetTokenBalance_ethereum_address_balances[] | null;
}

export interface GetTokenBalance_ethereum {
  __typename: "Ethereum";
  /**
   * Basic information about address ( or smart contract )
   */
  address: GetTokenBalance_ethereum_address[];
}

export interface GetTokenBalance {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTokenBalance_ethereum | null;
}

export interface GetTokenBalanceVariables {
  network: EthereumNetwork;
  address: string;
  block: number;
}
