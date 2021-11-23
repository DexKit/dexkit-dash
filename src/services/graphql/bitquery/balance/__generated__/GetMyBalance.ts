/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {EthereumNetwork} from './../../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: GetMyBalance
// ====================================================

export interface GetMyBalance_ethereum_address_balances_currency {
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
  /**
   * Token Type
   */
  tokenType: string | null;
}

export interface GetMyBalance_ethereum_address_balances {
  __typename: 'EthereumBalance';
  /**
   * Currency of transfer
   */
  currency: GetMyBalance_ethereum_address_balances_currency | null;
  value: number | null;
  valueInUsd: number | null;
}

export interface GetMyBalance_ethereum_address {
  __typename: 'EthereumAddressInfoWithBalance';
  /**
   * DEPRECATED Balances by currencies for the address
   */
  balances: GetMyBalance_ethereum_address_balances[] | null;
}

export interface GetMyBalance_ethereum {
  __typename: 'Ethereum';
  /**
   * Basic information about address ( or smart contract )
   */
  address: GetMyBalance_ethereum_address[];
}

export interface GetMyBalance {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetMyBalance_ethereum | null;
}

export interface GetMyBalanceVariables {
  network: EthereumNetwork;
  address: string;
}
