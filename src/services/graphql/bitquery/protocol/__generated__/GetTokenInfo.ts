/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {
  EthereumNetwork,
  SmartContractType,
} from './../../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: GetTokenInfo
// ====================================================

export interface GetTokenInfo_ethereum_address_smartContract_currency {
  __typename: 'Currency';
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Decimals
   */
  decimals: number;
  /**
   * Token Type
   */
  tokenType: string | null;
}

export interface GetTokenInfo_ethereum_address_smartContract {
  __typename: 'EthereumSmartContractInfoWithAttributes';
  /**
   * Smart Contract Type
   */
  contractType: SmartContractType | null;
  /**
   * Token implemented in this smart contract
   */
  currency: GetTokenInfo_ethereum_address_smartContract_currency | null;
}

export interface GetTokenInfo_ethereum_address {
  __typename: 'EthereumAddressInfoWithBalance';
  /**
   * Annotations ( tags ), if exists
   */
  annotation: string | null;
  /**
   * String address representation
   */
  address: string;
  /**
   * Smart Contract if exists on the address
   */
  smartContract: GetTokenInfo_ethereum_address_smartContract | null;
  /**
   * DEPRECATED Current address balance
   */
  balance: number | null;
}

export interface GetTokenInfo_ethereum {
  __typename: 'Ethereum';
  /**
   * Basic information about address ( or smart contract )
   */
  address: GetTokenInfo_ethereum_address[];
}

export interface GetTokenInfo {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTokenInfo_ethereum | null;
}

export interface GetTokenInfoVariables {
  network: EthereumNetwork;
  address: string;
}
