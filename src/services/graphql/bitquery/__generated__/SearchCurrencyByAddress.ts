/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {Network} from './../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: SearchCurrencyByAddress
// ====================================================

export interface SearchCurrencyByAddress_search_subject_Address {
  __typename: 'Address' | 'HederaAccount' | 'SmartContract' | 'TransactionHash';
}

export interface SearchCurrencyByAddress_search_subject_Currency {
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
   * Token Smart Contract Address
   */
  currencyAddress: string | null;
  /**
   * Token ID
   */
  tokenId: string | null;
  /**
   * Token Type
   */
  tokenType: string | null;
  /**
   * Decimals
   */
  decimals: number;
}

export type SearchCurrencyByAddress_search_subject =
  | SearchCurrencyByAddress_search_subject_Address
  | SearchCurrencyByAddress_search_subject_Currency;

export interface SearchCurrencyByAddress_search_network {
  __typename: 'BlockchainNetwork';
  /**
   * Network name
   */
  network: Network;
}

export interface SearchCurrencyByAddress_search {
  __typename: 'Result';
  /**
   * Subject in blockchain
   */
  subject: SearchCurrencyByAddress_search_subject;
  /**
   * Blockchain where result is found
   */
  network: SearchCurrencyByAddress_search_network;
}

export interface SearchCurrencyByAddress {
  /**
   * Search by query string
   */
  search: SearchCurrencyByAddress_search[] | null;
}

export interface SearchCurrencyByAddressVariables {
  value: string;
}
