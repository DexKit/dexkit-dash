/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllMyBalance
// ====================================================

export interface GetAllMyBalance_ethereum_address_balances_currency {
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
   * Decimals
   */
  decimals: number;
  /**
   * Token Smart Contract Address
   */
  address: string | null;
}

export interface GetAllMyBalance_ethereum_address_balances {
  __typename: 'EthereumBalance';
  /**
   * Currency of transfer
   */
  currency: GetAllMyBalance_ethereum_address_balances_currency | null;
  value: number | null;
  valueInUsd: number | null;
}

export interface GetAllMyBalance_ethereum_address {
  __typename: 'EthereumAddressInfoWithBalance';
  /**
   * DEPRECATED Balances by currencies for the address
   */
  balances: GetAllMyBalance_ethereum_address_balances[] | null;
}

export interface GetAllMyBalance_ethereum {
  __typename: 'Ethereum';
  /**
   * Basic information about address ( or smart contract )
   */
  address: GetAllMyBalance_ethereum_address[];
}

export interface GetAllMyBalance_bsc_address_balances_currency {
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
   * Decimals
   */
  decimals: number;
  /**
   * Token Smart Contract Address
   */
  address: string | null;
}

export interface GetAllMyBalance_bsc_address_balances {
  __typename: 'EthereumBalance';
  /**
   * Currency of transfer
   */
  currency: GetAllMyBalance_bsc_address_balances_currency | null;
  value: number | null;
  valueInUsd: number | null;
}

export interface GetAllMyBalance_bsc_address {
  __typename: 'EthereumAddressInfoWithBalance';
  /**
   * DEPRECATED Balances by currencies for the address
   */
  balances: GetAllMyBalance_bsc_address_balances[] | null;
}

export interface GetAllMyBalance_bsc {
  __typename: 'Ethereum';
  /**
   * Basic information about address ( or smart contract )
   */
  address: GetAllMyBalance_bsc_address[];
}

export interface GetAllMyBalance {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetAllMyBalance_ethereum | null;
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  bsc: GetAllMyBalance_bsc | null;
}

export interface GetAllMyBalanceVariables {
  address: string;
}
